<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPageController extends Controller
{
    public function index(Request $request): Response
    {
        $items = Notification::query()
            ->where('user_id', $request->user()->id)
            ->with(['sender:id,name,email,image'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Gym/Notifications', [
            'notifications' => $items->map(function (Notification $n) {
                $sender = $n->sender;

                return [
                    'id' => (string) $n->id,
                    'notification_text' => $n->notification_text,
                    'type' => $n->type,
                    'read' => $n->read,
                    'pathName' => $n->path_name,
                    'createdAt' => $n->created_at?->toIso8601String(),
                    'sender' => $sender ? [
                        'name' => $sender->name,
                    ] : null,
                ];
            })->values()->all(),
        ]);
    }

    public function markRead(Request $request, Notification $notification): RedirectResponse
    {
        if ((int) $notification->user_id !== (int) $request->user()->id) {
            abort(403);
        }

        $notification->update(['read' => true]);

        return back();
    }
}
