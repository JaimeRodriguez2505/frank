<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImportRequestPortalResource;
use App\Models\ImportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientPortalController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'codigo_cliente' => $user?->codigo_cliente,
            'last_login_at' => $user?->last_login_at?->toISOString(),
        ]);
    }

    public function requests(Request $request)
    {
        $user = $request->user();
        $codigo = $user?->codigo_cliente;

        $requests = ImportRequest::where('codigo_cliente', $codigo)
            ->with(['events' => function ($query) {
                $query->where('visible_cliente', true)->orderBy('ocurrido_en', 'asc');
            }])
            ->latest()
            ->get();

        return ImportRequestPortalResource::collection($requests);
    }
}
