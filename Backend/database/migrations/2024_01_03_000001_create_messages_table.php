<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['user', 'assistant']);
            $table->longText('content');
            $table->unsignedInteger('tokens')->nullable();
            $table->timestamps();

            $table->index('conversation_id');
            $table->index('role');
            $table->index('created_at');
            $table->index(['conversation_id', 'created_at']);
            $table->index(['conversation_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
