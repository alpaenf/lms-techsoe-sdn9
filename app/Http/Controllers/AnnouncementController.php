<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
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

        if (!$announcement) {
            abort(404);
        }

        return Inertia::render('Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|in:all,siswa,guru,admin,pimpinan,bk',
            'is_popup' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['published_at'] = now();

        DB::table('announcements')->insert(array_merge($validated, [
            'created_at' => now(),
            'updated_at' => now(),
        ]));

        return back()->with('success', 'Pengumuman berhasil dibuat');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|in:all,siswa,guru,admin,pimpinan,bk',
            'is_popup' => 'boolean',
        ]);

        DB::table('announcements')
            ->where('id', $id)
            ->update(array_merge($validated, [
                'updated_at' => now(),
            ]));

        return back()->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy($id)
    {
        DB::table('announcements')->where('id', $id)->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus');
    }
}
