<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_portal_users', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_cliente', 50)->unique();
            $table->string('pin_hash');
            $table->timestamp('pin_created_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->unsignedSmallInteger('failed_attempts')->default(0);
            $table->timestamp('last_failed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_portal_users');
    }
};
