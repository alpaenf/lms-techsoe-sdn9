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
        Schema::table('exam_questions', function (Blueprint $table) {
            if (! Schema::hasColumn('exam_questions', 'image_alignment')) {
                $table->string('image_alignment', 20)->default('center')->nullable()->after('question_image');
            }
            if (! Schema::hasColumn('exam_questions', 'image_position')) {
                $table->string('image_position', 20)->default('bottom')->nullable()->after('image_alignment');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            if (Schema::hasColumn('exam_questions', 'image_alignment')) {
                $table->dropColumn('image_alignment');
            }
            if (Schema::hasColumn('exam_questions', 'image_position')) {
                $table->dropColumn('image_position');
            }
        });
    }
};

