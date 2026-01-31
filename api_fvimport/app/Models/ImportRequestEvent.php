<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportRequestEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'import_request_id',
        'estado',
        'progreso',
        'etapa_logistica',
        'nota',
        'ocurrido_en',
        'visible_cliente',
    ];

    protected $casts = [
        'ocurrido_en' => 'datetime',
        'visible_cliente' => 'boolean',
    ];

    public function importRequest()
    {
        return $this->belongsTo(ImportRequest::class);
    }
}
