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
            // Drop foreign key constraint and column
            $table->dropForeign(['sub_category_id']);
            $table->dropColumn('sub_category_id');

            // Add new category_id foreign key
            $table->foreignId('category_id')
                  ->after('SKU')
                  ->constrained('categories')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop category foreign key
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            // Restore subcategory foreign key
            $table->foreignId('sub_category_id')
                  ->after('SKU')
                  ->constrained('subcategories')
                  ->onDelete('cascade');
        });
    }
};
