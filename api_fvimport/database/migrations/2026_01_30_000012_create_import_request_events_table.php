<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_request_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_request_id')->constrained('import_requests')->cascadeOnDelete();
            $table->enum('estado', ['pendiente', 'en_proceso', 'completado', 'cancelado'])->nullable();
            $table->unsignedTinyInteger('progreso')->default(0);
            $table->string('etapa_logistica', 100)->nullable();
            $table->text('nota')->nullable();
            $table->timestamp('ocurrido_en')->nullable();
            $table->boolean('visible_cliente')->default(true);
            $table->timestamps();

            $table->index(['import_request_id', 'ocurrido_en']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_request_events');
    }
};
