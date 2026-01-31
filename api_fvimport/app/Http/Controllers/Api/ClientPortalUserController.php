<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientPortalUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class ClientPortalUserController extends Controller
{
    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo_cliente' => 'required|string|max:50',
            'pin' => 'required|string|min:4|max:8',
        ]);

        $user = ClientPortalUser::updateOrCreate(
            ['codigo_cliente' => $validated['codigo_cliente']],
            [
                'pin_hash' => Hash::make($validated['pin']),
                'pin_created_at' => Carbon::now(),
                'failed_attempts' => 0,
                'last_failed_at' => null,
            ]
        );

        return response()->json([
            'message' => 'PIN actualizado',
            'codigo_cliente' => $user->codigo_cliente,
        ]);
    }
}
