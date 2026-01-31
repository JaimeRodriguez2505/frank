<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImportRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre_pieza' => $this->nombre_pieza,
            'tipo_importacion' => $this->tipo_importacion,
            'email' => $this->email,
            'telefono' => $this->telefono,
            'mensaje' => $this->mensaje,
            'marca_vehiculo' => $this->marca_vehiculo,
            'modelo_vehiculo' => $this->modelo_vehiculo,
            'anio_vehiculo' => $this->anio_vehiculo,
            'pais_origen' => $this->pais_origen,
            'nivel_urgencia' => $this->nivel_urgencia,
            'imagenes' => $this->imagenes,
            'estado' => $this->estado,
            'codigo_cliente' => $this->codigo_cliente,
            'progreso' => $this->progreso,
            'etapa_logistica' => $this->etapa_logistica,
            'ciudad_destino' => $this->ciudad_destino,
            'eta_fecha' => $this->eta_fecha?->toDateString(),
            'comentario_cliente' => $this->comentario_cliente,
            'comentario_interno' => $this->comentario_interno,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
