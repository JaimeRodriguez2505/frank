<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeaturedCategorySettingResource;
use App\Models\FeaturedCategorySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeaturedCategoryController extends Controller
{
    /**
     * GET /api/featured-category - Obtener la configuración actual
     */
    public function index(): JsonResponse
    {
        $setting = FeaturedCategorySetting::with('category')->first();

        if (!$setting) {
            return response()->json([
                'category_id' => null,
                'category' => null
            ]);
        }

        return (new FeaturedCategorySettingResource($setting))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * PUT /api/featured-category - Actualizar la categoría destacada
     */
    public function update(Request $request): FeaturedCategorySettingResource
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $setting = FeaturedCategorySetting::first();

        if (!$setting) {
            $setting = FeaturedCategorySetting::create([
                'category_id' => $validated['category_id'] ?? null
            ]);
        } else {
            $setting->update([
                'category_id' => $validated['category_id'] ?? null
            ]);
        }

        $setting->load('category');

        return new FeaturedCategorySettingResource($setting);
    }
}
