<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = DB::table('announcements')
            ->join('users', 'announcements.created_by', '=', 'users.id')
            ->select(
                'announcements.*',
                'users.name as author_name'
            )
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        $announcements->through(function ($item) {
            $item->documentation_images = ! empty($item->documentation_images) ? json_decode($item->documentation_images, true) : [];

            return $item;
        });

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function show($id)
    {
        $announcement = DB::table('announcements')
            ->join('users', 'announcements.created_by', '=', 'users.id')
            ->where('announcements.id', $id)
            ->select(
                'announcements.*',
                'users.name as author_name'
            )
            ->first();

        if (! $announcement) {
            abort(404);
        }

        $announcement->documentation_images = ! empty($announcement->documentation_images) ? json_decode($announcement->documentation_images, true) : [];

        $recentAnnouncements = DB::table('announcements')
            ->where('id', '!=', $id)
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(4)
            ->get(['id', 'title', 'image', 'published_at', 'target_role']);

        return Inertia::render('Announcements/Show', [
            'announcement' => $announcement,
            'recentAnnouncements' => $recentAnnouncements,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|string',
            'is_popup' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'documentation_images' => 'nullable|array',
            'documentation_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('announcements', 'public');
            $imagePath = '/storage/'.$path;
        }

        $docPaths = [];
        if ($request->hasFile('documentation_images')) {
            foreach ($request->file('documentation_images') as $file) {
                $path = $file->store('announcements/docs', 'public');
                $docPaths[] = '/storage/'.$path;
            }
        }

        $data = [
            'title' => $validated['title'],
            'content' => $validated['content'],
            'target_role' => $validated['target_role'],
            'is_popup' => (bool) ($request->input('is_popup', false)),
            'image' => $imagePath,
            'documentation_images' => ! empty($docPaths) ? json_encode($docPaths) : null,
            'created_by' => auth()->id(),
            'published_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('announcements')->insert($data);

        return back()->with('success', 'Pengumuman / Berita kegiatan berhasil diterbitkan');
    }

    public function update(Request $request, $id)
    {
        $announcement = DB::table('announcements')->where('id', $id)->first();
        if (! $announcement) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|string',
            'is_popup' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'remove_image' => 'nullable|boolean',
            'documentation_images' => 'nullable|array',
            'documentation_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'existing_documentation_images' => 'nullable|array',
            'existing_documentation_images.*' => 'nullable|string',
        ]);

        $imagePath = $announcement->image;
        if ($request->boolean('remove_image')) {
            if ($imagePath) {
                $relPath = str_replace('/storage/', '', $imagePath);
                Storage::disk('public')->delete($relPath);
            }
            $imagePath = null;
        }

        if ($request->hasFile('image')) {
            if ($imagePath) {
                $relPath = str_replace('/storage/', '', $imagePath);
                Storage::disk('public')->delete($relPath);
            }
            $path = $request->file('image')->store('announcements', 'public');
            $imagePath = '/storage/'.$path;
        }

        $existingDocs = $request->input('existing_documentation_images', []);
        if (! is_array($existingDocs)) {
            $existingDocs = [];
        }

        $oldDocs = $announcement->documentation_images ? json_decode($announcement->documentation_images, true) : [];
        if (is_array($oldDocs)) {
            foreach ($oldDocs as $oldDoc) {
                if (! in_array($oldDoc, $existingDocs, true)) {
                    $relPath = str_replace('/storage/', '', $oldDoc);
                    Storage::disk('public')->delete($relPath);
                }
            }
        }

        $newDocs = [];
        if ($request->hasFile('documentation_images')) {
            foreach ($request->file('documentation_images') as $file) {
                $path = $file->store('announcements/docs', 'public');
                $newDocs[] = '/storage/'.$path;
            }
        }

        $allDocs = array_values(array_merge($existingDocs, $newDocs));

        $updateData = [
            'title' => $validated['title'],
            'content' => $validated['content'],
            'target_role' => $validated['target_role'],
            'is_popup' => (bool) ($request->input('is_popup', false)),
            'image' => $imagePath,
            'documentation_images' => ! empty($allDocs) ? json_encode($allDocs) : null,
            'updated_at' => now(),
        ];

        DB::table('announcements')->where('id', $id)->update($updateData);

        return back()->with('success', 'Pengumuman / Berita kegiatan berhasil diperbarui');
    }

    public function destroy($id)
    {
        $announcement = DB::table('announcements')->where('id', $id)->first();
        if ($announcement) {
            if ($announcement->image) {
                $relPath = str_replace('/storage/', '', $announcement->image);
                Storage::disk('public')->delete($relPath);
            }
            if ($announcement->documentation_images) {
                $docs = json_decode($announcement->documentation_images, true);
                if (is_array($docs)) {
                    foreach ($docs as $doc) {
                        $relPath = str_replace('/storage/', '', $doc);
                        Storage::disk('public')->delete($relPath);
                    }
                }
            }
            DB::table('announcements')->where('id', $id)->delete();
        }

        return back()->with('success', 'Pengumuman / Berita berhasil dihapus');
    }
}
