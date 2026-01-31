<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class ClientPortalUser extends Model
{
    use HasApiTokens;
    use HasFactory;

    protected $fillable = [
        'codigo_cliente',
        'pin_hash',
        'pin_created_at',
        'last_login_at',
        'failed_attempts',
        'last_failed_at',
    ];

    protected $casts = [
        'pin_created_at' => 'datetime',
        'last_login_at' => 'datetime',
        'last_failed_at' => 'datetime',
    ];
}
