<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImportRequestEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'estado' => $this->estado,
            'progreso' => $this->progreso,
            'etapa_logistica' => $this->etapa_logistica,
            'nota' => $this->nota,
            'ocurrido_en' => $this->ocurrido_en?->toISOString(),
        ];
    }
}
