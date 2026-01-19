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
        Schema::table('featured_category_settings', function (Blueprint $table) {
            // Drop foreign key constraint and column
            $table->dropForeign(['subcategory_id']);
            $table->dropColumn('subcategory_id');

            // Add new category_id foreign key
            $table->foreignId('category_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('categories')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('featured_category_settings', function (Blueprint $table) {
            // Drop category foreign key
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            // Restore subcategory foreign key
            $table->foreignId('subcategory_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('subcategories')
                  ->onDelete('set null');
        });
    }
};
