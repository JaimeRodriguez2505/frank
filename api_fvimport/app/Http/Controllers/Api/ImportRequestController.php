<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportRequestRequest;
use App\Http\Resources\ImportRequestResource;
use App\Models\ImportRequest;
use App\Models\ImportRequestEvent;
use App\Services\ImageOptimizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImportRequestController extends Controller
{
    /**
     * GET /api/import-requests - List all (protected)
     */
    public function index(): AnonymousResourceCollection
    {
        $requests = ImportRequest::latest()->get();
        return ImportRequestResource::collection($requests);
    }

    /**
     * GET /api/import-requests/{id} - Show single request (protected)
     */
    public function show(ImportRequest $importRequest): ImportRequestResource
    {
        return new ImportRequestResource($importRequest);
    }

    /**
     * POST /api/import-requests - Create new request (public)
     */
    public function store(ImportRequestRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Handle multiple image uploads
        if ($request->hasFile('imagenes')) {
            $imagePaths = [];
            $images = $request->file('imagenes');

            // Ensure it's an array
            if (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $imageFile) {
                if ($imageFile->isValid()) {
                    // Optimize and store image
                    $optimizedPath = ImageOptimizer::optimizeWithGD($imageFile);

                    if ($optimizedPath !== $imageFile->getRealPath()) {
                        $originalName = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                        $newFileName = $originalName . '.jpg';

                        $optimizedFile = new UploadedFile(
                            $optimizedPath,
                            $newFileName,
                            'image/jpeg',
                            null,
                            true
                        );

                        $path = $optimizedFile->store('import-requests', 'public');
                        @unlink($optimizedPath);
                    } else {
                        $path = $imageFile->store('import-requests', 'public');
                    }

                    $imagePaths[] = '/storage/' . $path;
                }
            }

            $data['imagenes'] = $imagePaths;
        }

        $importRequest = ImportRequest::create($data);

        return (new ImportRequestResource($importRequest))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT /api/import-requests/{id}/estado - Update status (protected)
     */
    public function updateStatus(Request $request, ImportRequest $importRequest): ImportRequestResource
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,completado,cancelado'
        ]);

        $importRequest->update($validated);

        return new ImportRequestResource($importRequest);
    }

    /**
     * PUT /api/import-requests/{id}/tracking - Update tracking fields (protected)
     */
    public function updateTracking(Request $request, ImportRequest $importRequest): ImportRequestResource
    {
        $validated = $request->validate([
            'codigo_cliente' => 'nullable|string|max:50',
            'progreso' => 'nullable|integer|min:0|max:100',
            'etapa_logistica' => 'nullable|string|max:100',
            'ciudad_destino' => 'nullable|string|max:120',
            'eta_fecha' => 'nullable|date',
            'comentario_cliente' => 'nullable|string',
            'comentario_interno' => 'nullable|string',
        ]);

        $importRequest->update($validated);

        return new ImportRequestResource($importRequest);
    }

    /**
     * POST /api/import-requests/{id}/events - Add tracking event (protected)
     */
    public function addEvent(Request $request, ImportRequest $importRequest): ImportRequestResource
    {
        $validated = $request->validate([
            'estado' => 'nullable|in:pendiente,en_proceso,completado,cancelado',
            'progreso' => 'nullable|integer|min:0|max:100',
            'etapa_logistica' => 'nullable|string|max:100',
            'nota' => 'nullable|string',
            'ocurrido_en' => 'nullable|date',
            'visible_cliente' => 'nullable|boolean',
        ]);

        ImportRequestEvent::create([
            'import_request_id' => $importRequest->id,
            'estado' => $validated['estado'] ?? $importRequest->estado,
            'progreso' => $validated['progreso'] ?? $importRequest->progreso ?? 0,
            'etapa_logistica' => $validated['etapa_logistica'] ?? $importRequest->etapa_logistica,
            'nota' => $validated['nota'] ?? null,
            'ocurrido_en' => $validated['ocurrido_en'] ?? now(),
            'visible_cliente' => $validated['visible_cliente'] ?? true,
        ]);

        if (array_key_exists('progreso', $validated)) {
            $importRequest->progreso = $validated['progreso'];
        }
        if (array_key_exists('estado', $validated)) {
            $importRequest->estado = $validated['estado'];
        }
        if (array_key_exists('etapa_logistica', $validated)) {
            $importRequest->etapa_logistica = $validated['etapa_logistica'];
        }
        $importRequest->save();

        return new ImportRequestResource($importRequest->refresh());
    }

    /**
     * DELETE /api/import-requests/{id} - Delete request (protected)
     */
    public function destroy(ImportRequest $importRequest): JsonResponse
    {
        // Delete associated images from storage
        if ($importRequest->imagenes && is_array($importRequest->imagenes)) {
            foreach ($importRequest->imagenes as $imagePath) {
                $path = str_replace('/storage/', '', $imagePath);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $importRequest->delete();

        return response()->json([
            'message' => 'Import request deleted successfully'
        ], Response::HTTP_OK);
    }

    /**
     * GET /api/import-requests/tracking/{email} - Get requests by email (public)
     */
    public function getByEmail(string $email): AnonymousResourceCollection
    {
        $requests = ImportRequest::where('email', $email)
            ->latest()
            ->get();

        return ImportRequestResource::collection($requests);
    }

    /**
     * POST /api/import-requests/{id}/payment-proof - Upload payment proof (public)
     */
    public function uploadPaymentProof(Request $request, ImportRequest $importRequest): JsonResponse
    {
        $validated = $request->validate([
            'proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120' // 5MB max
        ]);

        // Delete old proof if exists
        if ($importRequest->comprobante_pago) {
            $oldPath = str_replace('/storage/', '', $importRequest->comprobante_pago);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        // Store new proof
        $file = $request->file('proof');
        $path = $file->store('payment-proofs', 'public');

        $importRequest->update([
            'comprobante_pago' => '/storage/' . $path
        ]);

        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'data' => new ImportRequestResource($importRequest)
        ], Response::HTTP_OK);
    }
}
