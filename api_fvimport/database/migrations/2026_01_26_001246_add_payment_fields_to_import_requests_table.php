<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('import_requests', function (Blueprint $table) {
            $table->decimal('adelanto_requerido', 10, 2)->nullable()->after('estado');
            $table->enum('estado_pago', ['pendiente', 'adelanto_pagado', 'completo'])->default('pendiente')->after('adelanto_requerido');
            $table->string('qr_pago', 255)->nullable()->after('estado_pago');
            $table->enum('metodo_pago', ['yape', 'plin', 'transferencia'])->nullable()->after('qr_pago');
            $table->integer('tiempo_estimado_dias')->nullable()->after('metodo_pago');
            $table->string('comprobante_pago', 255)->nullable()->after('tiempo_estimado_dias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('import_requests', function (Blueprint $table) {
            $table->dropColumn([
                'adelanto_requerido',
                'estado_pago',
                'qr_pago',
                'metodo_pago',
                'tiempo_estimado_dias',
                'comprobante_pago'
            ]);
        });
    }
};
