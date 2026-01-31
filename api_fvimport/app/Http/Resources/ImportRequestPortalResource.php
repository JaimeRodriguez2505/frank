<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ImportRequestEventResource;

class ImportRequestPortalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre_pieza' => $this->nombre_pieza,
            'tipo_importacion' => $this->tipo_importacion,
            'marca_vehiculo' => $this->marca_vehiculo,
            'modelo_vehiculo' => $this->modelo_vehiculo,
            'anio_vehiculo' => $this->anio_vehiculo,
            'estado' => $this->estado,
            'progreso' => $this->progreso ?? 0,
            'etapa_logistica' => $this->etapa_logistica,
            'ciudad_destino' => $this->ciudad_destino,
            'eta_fecha' => $this->eta_fecha?->toDateString(),
            'comentario_cliente' => $this->comentario_cliente,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'eventos' => ImportRequestEventResource::collection(
                $this->whenLoaded('events')
            ),
        ];
    }
}
