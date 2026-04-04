<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $notificationBell = [
            'unread' => 0,
            'items' => [],
        ];

        if ($user) {
            $notificationBell['unread'] = Notification::query()
                ->where('user_id', $user->id)
                ->where('read', false)
                ->count();

            $notificationBell['items'] = Notification::query()
                ->where('user_id', $user->id)
                ->where('read', false)
                ->orderByDesc('created_at')
                ->limit(8)
                ->get()
                ->map(fn (Notification $n) => [
                    'id' => (string) $n->id,
                    'notification_text' => $n->notification_text,
                    'pathName' => $n->path_name,
                    'createdAt' => $n->created_at?->toIso8601String(),
                ])
                ->values()
                ->all();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? (new UserResource($user))->resolve() : null,
            ],
            'notificationBell' => $notificationBell,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
