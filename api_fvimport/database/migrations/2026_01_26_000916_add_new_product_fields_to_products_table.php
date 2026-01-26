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
        Schema::table('products', function (Blueprint $table) {
            $table->text('compatibilidad')->nullable()->after('description');
            $table->string('origen', 100)->nullable()->after('compatibilidad');
            $table->string('marca', 100)->nullable()->after('origen');
            $table->decimal('peso', 8, 2)->nullable()->after('marca');
            $table->enum('condicion', ['nuevo_original', 'alternativo', 'usado'])->default('nuevo_original')->after('peso');
            $table->enum('disponibilidad', ['en_stock', 'en_oferta', 'solo_pedido'])->default('en_stock')->after('condicion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'compatibilidad',
                'origen',
                'marca',
                'peso',
                'condicion',
                'disponibilidad'
            ]);
        });
    }
};
