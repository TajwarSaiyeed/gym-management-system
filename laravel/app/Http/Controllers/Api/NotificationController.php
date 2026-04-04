<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = User::query()->where('id', $request->user()->id)->where('email', $request->user()->email)->first();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $notifications = Notification::query()
            ->where('user_id', $user->id)
            ->with([
                'sender:id,name,email,image',
                'user:id,name,email,image',
            ])
            ->get();

        if ($notifications->isEmpty()) {
            return response()->json(['data' => [], 'unRead' => 0], 200);
        }

        $unRead = Notification::query()->where('user_id', $user->id)->where('read', false)->count();

        return response()->json([
            'data' => $notifications->map(fn (Notification $n) => $this->mapNotification($n))->values()->all(),
            'unRead' => $unRead,
        ], 200);
    }

    public function store(Request $request)
    {
        $body = $request->validate([
            'notification_text' => ['required', 'string'],
            'type' => ['required', 'string'],
            'userEmail' => ['nullable', 'string'],
            'userId' => ['nullable', 'string'],
            'senderId' => ['required', 'string'],
            'pathName' => ['required', 'string'],
        ]);

        $uEmail = null;
        $uid = null;

        if (! empty($body['userEmail'])) {
            $u = User::query()->where('email', $body['userEmail'])->first();
            if ($u) {
                $uEmail = $u->email;
                $uid = $u->id;
            }
        }

        if (! empty($body['userId'])) {
            $u = User::query()->find($body['userId']);
            if ($u) {
                $uEmail = $u->email;
                $uid = $u->id;
            }
        }

        $notification = Notification::create([
            'user_email' => $uEmail,
            'sender_id' => (int) $body['senderId'],
            'type' => $body['type'],
            'user_id' => $uid,
            'notification_text' => $body['notification_text'],
            'path_name' => $body['pathName'],
            'read' => false,
        ]);

        return response()->json(['data' => $this->mapNotification($notification)], 201);
    }

    public function markRead(Request $request, string $notificationId)
    {
        $notif = Notification::query()
            ->where('id', $notificationId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $notif) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }

        $notif->update(['read' => true]);

        return response()->json(['message' => 'Mark as read'], 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapNotification(Notification $n): array
    {
        $sender = $n->sender;
        $user = $n->user;

        return [
            'id' => (string) $n->id,
            'notification_text' => $n->notification_text,
            'type' => $n->type,
            'userEmail' => $n->user_email,
            'userId' => $n->user_id !== null ? (string) $n->user_id : null,
            'senderId' => $n->sender_id !== null ? (string) $n->sender_id : null,
            'read' => $n->read,
            'pathName' => $n->path_name,
            'createdAt' => $n->created_at,
            'updatedAt' => $n->updated_at,
            'sender' => $sender ? [
                'id' => (string) $sender->id,
                'name' => $sender->name,
                'email' => $sender->email,
                'image' => $sender->image,
            ] : null,
            'user' => $user ? [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image,
            ] : null,
        ];
    }
}
