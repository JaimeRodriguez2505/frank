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
        Schema::create('import_requests', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_pieza');
            $table->enum('tipo_importacion', ['tuning', 'repuestos', 'racing']);
            $table->string('email', 150);
            $table->string('telefono', 20);
            $table->text('mensaje');
            $table->string('marca_vehiculo', 100);
            $table->string('modelo_vehiculo', 100);
            $table->string('anio_vehiculo', 10);
            $table->string('pais_origen', 100);
            $table->enum('nivel_urgencia', ['baja', 'media', 'alta', 'urgente']);
            $table->json('imagenes')->nullable(); // Array of image paths
            $table->enum('estado', ['pendiente', 'en_proceso', 'completado', 'cancelado'])
                  ->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_requests');
    }
};
