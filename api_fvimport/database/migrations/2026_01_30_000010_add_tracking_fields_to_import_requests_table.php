<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('import_requests', function (Blueprint $table) {
            $table->string('codigo_cliente', 50)->nullable()->index();
            $table->unsignedTinyInteger('progreso')->default(0);
            $table->string('etapa_logistica', 100)->nullable();
            $table->string('ciudad_destino', 120)->nullable();
            $table->date('eta_fecha')->nullable();
            $table->text('comentario_cliente')->nullable();
            $table->text('comentario_interno')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('import_requests', function (Blueprint $table) {
            $table->dropColumn([
                'codigo_cliente',
                'progreso',
                'etapa_logistica',
                'ciudad_destino',
                'eta_fecha',
                'comentario_cliente',
                'comentario_interno',
            ]);
        });
    }
};
