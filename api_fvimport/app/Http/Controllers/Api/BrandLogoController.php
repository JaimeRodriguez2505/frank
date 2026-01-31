<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandLogoResource;
use App\Models\BrandLogo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class BrandLogoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = BrandLogo::query();
        if ($request->boolean('active_only', true)) {
            $query->where('active', true);
        }
        $logos = $query->orderBy('sort_order')->latest()->get();
        return BrandLogoResource::collection($logos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:120',
            'sort_order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
            'image' => 'required|file|mimes:jpg,jpeg,png,webp,svg|max:4096',
        ]);

        $path = $request->file('image')->store('brand-logos', 'public');

        $logo = BrandLogo::create([
            'name' => $validated['name'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'active' => $validated['active'] ?? true,
            'image_path' => '/storage/' . $path,
        ]);

        return (new BrandLogoResource($logo))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(Request $request, BrandLogo $brandLogo): BrandLogoResource
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:120',
            'sort_order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $oldPath = str_replace('/storage/', '', $brandLogo->image_path);
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('brand-logos', 'public');
            $brandLogo->image_path = '/storage/' . $path;
        }

        if (array_key_exists('name', $validated)) {
            $brandLogo->name = $validated['name'];
        }
        if (array_key_exists('sort_order', $validated)) {
            $brandLogo->sort_order = $validated['sort_order'] ?? 0;
        }
        if (array_key_exists('active', $validated)) {
            $brandLogo->active = (bool) $validated['active'];
        }

        $brandLogo->save();

        return new BrandLogoResource($brandLogo);
    }

    public function destroy(BrandLogo $brandLogo): JsonResponse
    {
        $oldPath = str_replace('/storage/', '', $brandLogo->image_path);
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }
        $brandLogo->delete();

        return response()->json(['message' => 'Logo eliminado'], Response::HTTP_OK);
    }

    public function toggleActive(BrandLogo $brandLogo): BrandLogoResource
    {
        $brandLogo->active = !$brandLogo->active;
        $brandLogo->save();

        return new BrandLogoResource($brandLogo);
    }
}
