<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Rename 'images' to 'image'
            if (Schema::hasColumn('products', 'images')) {
                $table->renameColumn('images', 'image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Rollback: rename 'image' back to 'images'
            if (Schema::hasColumn('products', 'image')) {
                $table->renameColumn('image', 'images');
            }
        });
    }
};
