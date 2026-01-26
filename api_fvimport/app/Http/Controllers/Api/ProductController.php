<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\FeaturedCategorySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * GET /api/products - Lista completa con relaciones y filtros opcionales
     * Soporta filtros: ?marca=X&condicion=Y&disponibilidad=Z
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::with(['category', 'images']);

        // Filtro por marca
        if ($request->has('marca') && $request->marca) {
            $query->where('marca', $request->marca);
        }

        // Filtro por condición
        if ($request->has('condicion') && $request->condicion) {
            $query->where('condicion', $request->condicion);
        }

        // Filtro por disponibilidad
        if ($request->has('disponibilidad') && $request->disponibilidad) {
            $query->where('disponibilidad', $request->disponibilidad);
        }

        $products = $query->get();

        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{id} - Detalle individual con relaciones
     */
    public function show(Product $product): ProductResource
    {
        $product->load(['category', 'images']);

        return new ProductResource($product);
    }

    /**
     * GET /api/products/featured - Productos de la categoría destacada
     */
    public function featured(): AnonymousResourceCollection
    {
        $setting = FeaturedCategorySetting::first();

        if (!$setting || !$setting->category_id) {
            // Si no hay categoría destacada, devolver todos los productos
            $products = Product::with(['category', 'images'])->limit(8)->get();
            return ProductResource::collection($products);
        }

        // Obtener productos que pertenecen a la categoría destacada
        $products = Product::with(['category', 'images'])
            ->where('category_id', $setting->category_id)
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * POST /api/products - Crear nuevo producto
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Manejo seguro de imagen principal
        $data['imagen'] = $this->handleImageUpload($request);

        $product = Product::create($data);

        // Manejar imágenes adicionales si se enviaron
        $this->handleAdditionalImages($request, $product);

        $product->load(['category', 'images']);

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT|POST /api/products/{id}/update - Actualizar producto existente
     */
    public function update(ProductRequest $request, Product $product): ProductResource
    {
        $data = $request->validated();

        // Verificar si se debe eliminar la imagen principal
        if ($request->has('remove_main_image') && $request->input('remove_main_image') == '1') {
            \Log::info('Removing main image for product', ['product_id' => $product->id]);

            // Eliminar imagen del storage
            if ($product->imagen) {
                $oldImagePath = str_replace('/storage/', '', $product->imagen);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                    \Log::info('Main image deleted from storage', ['path' => $oldImagePath]);
                }
            }

            $data['imagen'] = null;
        }
        // Manejo seguro de imagen principal (solo si se sube una nueva)
        elseif ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
            // Eliminar imagen anterior si existe
            if ($product->imagen) {
                $oldImagePath = str_replace('/storage/', '', $product->imagen);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $data['imagen'] = $this->handleImageUpload($request);
        } else {
            // Si no se envió nueva imagen, mantener la actual
            unset($data['imagen']);
        }

        $product->update($data);

        // Eliminar imágenes adicionales marcadas para eliminación
        if ($request->has('delete_images')) {
            $imagesToDelete = $request->input('delete_images');
            if (is_array($imagesToDelete)) {
                \Log::info('Deleting additional images', [
                    'product_id' => $product->id,
                    'image_ids' => $imagesToDelete
                ]);

                foreach ($imagesToDelete as $imageId) {
                    $image = $product->images()->find($imageId);
                    if ($image) {
                        // Eliminar archivo del storage
                        $imagePath = str_replace('/storage/', '', $image->image_path);
                        if (Storage::disk('public')->exists($imagePath)) {
                            Storage::disk('public')->delete($imagePath);
                            \Log::info('Additional image deleted from storage', [
                                'image_id' => $imageId,
                                'path' => $imagePath
                            ]);
                        }

                        // Eliminar registro de la base de datos
                        $image->delete();
                    }
                }
            }
        }

        // Manejar imágenes adicionales nuevas si se enviaron
        $this->handleAdditionalImages($request, $product);

        $product->load(['category', 'images']);

        return new ProductResource($product);
    }

    /**
     * DELETE /api/products/{id} - Eliminar producto
     */
    public function destroy(Product $product): JsonResponse
    {
        // Eliminar imagen principal del storage si existe
        if ($product->imagen && Storage::disk('public')->exists(str_replace('/storage/', '', $product->imagen))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->imagen));
        }

        // Eliminar imágenes adicionales
        foreach ($product->images as $image) {
            $imagePath = str_replace('/storage/', '', $image->image_path);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ], Response::HTTP_OK);
    }

    /**
     * Manejo de subida de imagen con conversión y optimización automática
     * Convierte CUALQUIER imagen a formato óptimo JPG
     */
    private function handleImageUpload(Request $request): ?string
    {
        if ($request->hasFile('imagen') && is_file($request->file('imagen'))) {
            $file = $request->file('imagen');

            // SIEMPRE optimizar y convertir a JPG
            $optimizedPath = \App\Services\ImageOptimizer::optimizeWithGD($file);

            // Si se optimizó (siempre debería), crear nuevo UploadedFile
            if ($optimizedPath !== $file->getRealPath()) {
                // Crear UploadedFile con el archivo optimizado
                // Cambiar nombre para reflejar conversión a JPG
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $newFileName = $originalName . '.jpg';

                $optimizedFile = new \Illuminate\Http\UploadedFile(
                    $optimizedPath,
                    $newFileName,
                    'image/jpeg',
                    null,
                    true // test mode para aceptar archivos temporales
                );

                $path = $optimizedFile->store('products', 'public');

                // Limpiar archivo temporal
                @unlink($optimizedPath);

                \Log::info('Image uploaded and optimized', [
                    'original' => $file->getClientOriginalName(),
                    'final' => $newFileName,
                    'path' => $path
                ]);
            } else {
                // Si no se pudo optimizar, usar original
                $path = $file->store('products', 'public');

                \Log::warning('Image uploaded without optimization', [
                    'file' => $file->getClientOriginalName()
                ]);
            }

            return '/storage/' . $path;
        }

        return null;
    }

    /**
     * Manejo de imágenes adicionales para productos
     * Procesa y almacena múltiples imágenes secundarias con orden
     */
    private function handleAdditionalImages(Request $request, Product $product): void
    {
        \Log::info('handleAdditionalImages called', [
            'product_id' => $product->id,
            'has_images_file' => $request->hasFile('images'),
            'all_files' => $request->allFiles(),
            'images_value' => $request->get('images')
        ]);

        if ($request->hasFile('images')) {
            $images = $request->file('images');

            \Log::info('Images file found', [
                'is_array' => is_array($images),
                'count' => is_array($images) ? count($images) : 1
            ]);

            // Si no es un array, convertirlo
            if (!is_array($images)) {
                $images = [$images];
            }

            // Obtener el último orden de las imágenes existentes
            $lastOrder = $product->images()->max('order') ?? -1;
            $order = $lastOrder + 1;

            foreach ($images as $imageFile) {
                if ($imageFile->isValid()) {
                    // SIEMPRE optimizar y convertir a JPG (igual que imagen principal)
                    $optimizedPath = \App\Services\ImageOptimizer::optimizeWithGD($imageFile);

                    // Si se optimizó, crear nuevo UploadedFile
                    if ($optimizedPath !== $imageFile->getRealPath()) {
                        $originalName = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                        $newFileName = $originalName . '.jpg';

                        $optimizedFile = new \Illuminate\Http\UploadedFile(
                            $optimizedPath,
                            $newFileName,
                            'image/jpeg',
                            null,
                            true
                        );

                        $path = $optimizedFile->store('products', 'public');

                        // Limpiar archivo temporal
                        @unlink($optimizedPath);

                        \Log::info('Additional image uploaded and optimized', [
                            'product_id' => $product->id,
                            'original' => $imageFile->getClientOriginalName(),
                            'final' => $newFileName,
                            'path' => $path,
                            'order' => $order
                        ]);
                    } else {
                        // Si no se pudo optimizar, usar original
                        $path = $imageFile->store('products', 'public');

                        \Log::warning('Additional image uploaded without optimization', [
                            'product_id' => $product->id,
                            'file' => $imageFile->getClientOriginalName()
                        ]);
                    }

                    // Crear registro de imagen adicional
                    $product->images()->create([
                        'image_path' => '/storage/' . $path,
                        'order' => $order
                    ]);

                    $order++;
                }
            }
        }
    }
}
