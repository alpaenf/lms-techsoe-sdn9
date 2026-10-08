<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KelembagaanController extends Controller
{
    public function index(): Response
    {
        $schoolProfile = DB::table('school_profiles')->first();
        $academicYears = DB::table('academic_years')->orderBy('id', 'desc')->get();

        return Inertia::render('Kelembagaan/Index', [
            'schoolProfile' => $schoolProfile,
            'academicYears' => $academicYears,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'npsn' => 'required|string|max:20',
            'principal_name' => 'required|string|max:255',
            'principal_nip' => 'required|string|max:30',
            'address' => 'required|string',
            'district' => 'nullable|string|max:100',
            'regency' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:25',
            'email' => 'nullable|email|max:100',
            'website' => 'nullable|string|max:100',
        ]);

        $profile = DB::table('school_profiles')->first();

        if ($profile) {
            DB::table('school_profiles')->where('id', $profile->id)->update([
                'school_name' => $request->school_name,
                'npsn' => $request->npsn,
                'principal_name' => $request->principal_name,
                'principal_nip' => $request->principal_nip,
                'address' => $request->address,
                'district' => $request->district ?? 'Gandangbatu Sillanan',
                'regency' => $request->regency ?? 'Tana Toraja',
                'province' => $request->province ?? 'Sulawesi Selatan',
                'phone' => $request->phone,
                'email' => $request->email,
                'website' => $request->website,
                'updated_at' => now(),
            ]);
        } else {
            DB::table('school_profiles')->insert([
                'school_name' => $request->school_name,
                'npsn' => $request->npsn,
                'principal_name' => $request->principal_name,
                'principal_nip' => $request->principal_nip,
                'address' => $request->address,
                'district' => $request->district ?? 'Gandangbatu Sillanan',
                'regency' => $request->regency ?? 'Tana Toraja',
                'province' => $request->province ?? 'Sulawesi Selatan',
                'phone' => $request->phone,
                'email' => $request->email,
                'website' => $request->website,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return back()->with('message', 'Data identitas pokok satuan pendidikan berhasil diperbarui.');
    }

    public function storeAcademicYear(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'semester' => 'required|in:ganjil,genap',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $isActive = $request->boolean('is_active', false);

        if ($isActive) {
            DB::table('academic_years')->update(['is_active' => false]);
        }

        DB::table('academic_years')->insert([
            'name' => $request->name,
            'semester' => $request->semester,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $isActive,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Tahun ajaran baru berhasil ditambahkan.');
    }

    public function activateAcademicYear(Request $request, $id)
    {
        DB::table('academic_years')->update(['is_active' => false]);

        DB::table('academic_years')->where('id', $id)->update([
            'is_active' => true,
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Status tahun ajaran aktif berhasil diperbarui.');
    }

    public function destroyAcademicYear($id)
    {
        $ay = DB::table('academic_years')->where('id', $id)->first();
        if ($ay && $ay->is_active) {
            return back()->withErrors(['is_active' => 'Tahun ajaran yang sedang aktif tidak dapat dihapus.']);
        }

        DB::table('academic_years')->where('id', $id)->delete();

        return back()->with('message', 'Data tahun ajaran berhasil dihapus.');
    }
}
