<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ImportRequestEvent;

/**
 * @property int $id
 * @property string $nombre_pieza
 * @property string $tipo_importacion
 * @property string $email
 * @property string $telefono
 * @property string $mensaje
 * @property string $marca_vehiculo
 * @property string $modelo_vehiculo
 * @property string $anio_vehiculo
 * @property string $pais_origen
 * @property string $nivel_urgencia
 * @property array|null $imagenes
 * @property string $estado
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class ImportRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_pieza',
        'tipo_importacion',
        'email',
        'telefono',
        'mensaje',
        'marca_vehiculo',
        'modelo_vehiculo',
        'anio_vehiculo',
        'pais_origen',
        'nivel_urgencia',
        'imagenes',
        'estado',
        'codigo_cliente',
        'progreso',
        'etapa_logistica',
        'ciudad_destino',
        'eta_fecha',
        'comentario_cliente',
        'comentario_interno',
        'adelanto_requerido',
        'estado_pago',
        'qr_pago',
        'metodo_pago',
        'tiempo_estimado_dias',
        'comprobante_pago',
    ];

    protected $casts = [
        'imagenes' => 'array',
        'adelanto_requerido' => 'decimal:2',
        'tiempo_estimado_dias' => 'integer',
        'progreso' => 'integer',
        'eta_fecha' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'estado' => 'pendiente',
        'estado_pago' => 'pendiente',
        'progreso' => 0,
    ];

    public function events()
    {
        return $this->hasMany(ImportRequestEvent::class)->orderBy('ocurrido_en', 'asc');
    }
}
