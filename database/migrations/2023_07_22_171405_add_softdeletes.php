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
        Schema::table('blank', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('patient', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('package', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('document', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('template', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blank', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('patient', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('package', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('document', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('template', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
