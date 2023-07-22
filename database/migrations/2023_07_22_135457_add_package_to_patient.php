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
        Schema::table('patient', function (Blueprint $table) {
            $table->unsignedBigInteger('package_id')->nullable();
        });

        Schema::table('patient', function ($table) {
            $table->foreign('package_id')->references('id')->on('package');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient', function (Blueprint $table) {
            $table->dropColumn(["package_id"]);
        });
    }
};
