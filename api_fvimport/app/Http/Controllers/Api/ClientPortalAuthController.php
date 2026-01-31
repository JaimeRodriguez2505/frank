<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientPortalUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class ClientPortalAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo_cliente' => 'required|string|max:50',
            'pin' => 'required|string|min:4|max:8',
        ]);

        $codigo = $validated['codigo_cliente'];
        $pin = $validated['pin'];

        $user = ClientPortalUser::where('codigo_cliente', $codigo)->first();
        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $now = Carbon::now();
        if ($user->failed_attempts >= 5 && $user->last_failed_at && $user->last_failed_at->gt($now->copy()->subMinutes(15))) {
            return response()->json(['message' => 'Demasiados intentos. Intenta más tarde.'], 429);
        }

        if (!Hash::check($pin, $user->pin_hash)) {
            $user->failed_attempts = min(10, $user->failed_attempts + 1);
            $user->last_failed_at = $now;
            $user->save();
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $user->failed_attempts = 0;
        $user->last_failed_at = null;
        $user->last_login_at = $now;
        $user->save();

        $token = $user->createToken('client-portal')->plainTextToken;

        return response()->json([
            'token' => $token,
            'codigo_cliente' => $user->codigo_cliente,
        ]);
    }
}
