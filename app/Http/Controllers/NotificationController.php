<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['notifications' => [], 'unread_count' => 0]);
            }

            return redirect()->route('login');
        }

        $notifications = AppNotification::forUser($user)
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get();

        $unreadCount = AppNotification::forUser($user)
            ->unread()
            ->count();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ]);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $notification = AppNotification::forUser($user)->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        if ($user) {
            AppNotification::forUser($user)
                ->unread()
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $notification = AppNotification::forUser($user)->where('id', $id)->first();

        if ($notification) {
            $notification->delete();
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
