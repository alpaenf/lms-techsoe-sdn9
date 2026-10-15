<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $studentUser;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->adminUser = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->studentUser = User::factory()->create([
            'role' => 'siswa',
        ]);
    }

    public function test_admin_can_create_announcement_with_documentation_images(): void
    {
        $coverImage = UploadedFile::fake()->image('kegiatan-upacara.jpg');
        $doc1 = UploadedFile::fake()->image('dokumentasi-1.jpg');
        $doc2 = UploadedFile::fake()->image('dokumentasi-2.jpg');

        $response = $this->actingAs($this->adminUser)->post(route('announcements.store'), [
            'title' => 'Upacara Hari Kemerdekaan RI di SDN 9 Gandangbatu Sillanan',
            'content' => 'Rangkaian kegiatan upacara bendera dan pentas seni berjalan dengan khidmat.',
            'target_role' => 'all',
            'is_popup' => false,
            'image' => $coverImage,
            'documentation_images' => [$doc1, $doc2],
        ]);

        $response->assertSessionHas('success');

        $announcement = DB::table('announcements')->where('title', 'Upacara Hari Kemerdekaan RI di SDN 9 Gandangbatu Sillanan')->first();
        $this->assertNotNull($announcement);
        $this->assertNotNull($announcement->image);

        $docImages = json_decode($announcement->documentation_images, true);
        $this->assertIsArray($docImages);
        $this->assertCount(2, $docImages);

        $coverDiskPath = str_replace('/storage/', '', $announcement->image);
        Storage::disk('public')->assertExists($coverDiskPath);
    }

    public function test_user_can_view_announcement_show_with_documentation(): void
    {
        $id = DB::table('announcements')->insertGetId([
            'title' => 'Kunjungan Edukasi Siswa',
            'content' => 'Dokumentasi kegiatan outing class kelas 4, 5, dan 6.',
            'target_role' => 'all',
            'is_popup' => false,
            'image' => '/storage/announcements/fake-cover.jpg',
            'documentation_images' => json_encode(['/storage/announcements/docs/fake-doc1.jpg']),
            'created_by' => $this->adminUser->id,
            'published_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->studentUser)->get(route('announcements.show', $id));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Announcements/Show')
            ->has('announcement')
            ->where('announcement.id', $id)
            ->where('announcement.documentation_images', ['/storage/announcements/docs/fake-doc1.jpg'])
        );
    }

    public function test_admin_can_update_announcement_documentation_images(): void
    {
        $id = DB::table('announcements')->insertGetId([
            'title' => 'Lomba Mewarnai Awal',
            'content' => 'Konten awal lomba mewarnai.',
            'target_role' => 'all',
            'is_popup' => false,
            'image' => null,
            'documentation_images' => null,
            'created_by' => $this->adminUser->id,
            'published_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $newCover = UploadedFile::fake()->image('new-cover.jpg');
        $doc = UploadedFile::fake()->image('doc-update.jpg');

        $response = $this->actingAs($this->adminUser)->put(route('announcements.update', $id), [
            'title' => 'Lomba Mewarnai Diperbarui',
            'content' => 'Konten setelah diperbarui.',
            'target_role' => 'all',
            'image' => $newCover,
            'documentation_images' => [$doc],
        ]);

        $response->assertSessionHas('success');

        $updated = DB::table('announcements')->where('id', $id)->first();
        $this->assertEquals('Lomba Mewarnai Diperbarui', $updated->title);
        $this->assertNotNull($updated->image);

        $docImages = json_decode($updated->documentation_images, true);
        $this->assertCount(1, $docImages);
    }
}
