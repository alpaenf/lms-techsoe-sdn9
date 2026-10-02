<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        $schoolProfile = DB::table('school_profiles')->first();

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'statusNisn' => session('status_nisn'),
            'schoolPhone' => $schoolProfile?->phone ?? '081234567890',
            'schoolName' => $schoolProfile?->school_name ?? 'UPT SDN 9 Gandangbatu Sillanan',
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * Handle password reset for students via NISN and Birth Date.
     *
     * @throws ValidationException
     */
    public function resetByNisn(Request $request): RedirectResponse
    {
        $request->validate([
            'nisn' => 'required|string',
            'birth_date' => 'required|date',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'nisn.required' => 'Nomor NISN siswa wajib diisi.',
            'birth_date.required' => 'Tanggal lahir siswa wajib diisi.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $nisnInput = trim($request->nisn);
        $student = Student::where(function ($q) use ($nisnInput) {
            $q->where('nisn', $nisnInput)
                ->orWhere('nis', $nisnInput);
        })
            ->whereDate('birth_date', $request->birth_date)
            ->first();

        if (! $student || ! $student->user_id) {
            throw ValidationException::withMessages([
                'nisn' => 'Kombinasi NISN / NIS dan Tanggal Lahir tidak cocok dengan pangkalan data sekolah. Silakan periksa kembali atau hubungi Wali Kelas.',
            ]);
        }

        $user = User::find($student->user_id);
        if (! $user) {
            throw ValidationException::withMessages([
                'nisn' => 'Akun pengguna untuk siswa ini belum aktif. Silakan hubungi pihak sekolah.',
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('status_nisn', 'Kata sandi siswa berhasil diperbarui! Anda dapat langsung masuk menggunakan NISN dan kata sandi baru Anda.');
    }
}
