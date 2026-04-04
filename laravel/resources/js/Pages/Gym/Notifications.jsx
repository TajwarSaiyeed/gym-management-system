import GymLayout from '@/Layouts/GymLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Notifications({ notifications }) {
    return (
        <GymLayout title="Notifications">
            <Head title="Notifications" />
            <ul className="divide-y rounded-xl bg-white shadow">
                {notifications.map((n) => (
                    <li key={n.id} className="flex items-start justify-between px-4 py-3">
                        <div>
                            <p className="text-sm">{n.notification_text}</p>
                            <p className="text-xs text-gray-500">
                                {n.sender?.name && `From ${n.sender.name} · `}
                                {n.type}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs">
                            {!n.read && (
                                <button
                                    type="button"
                                    className="text-indigo-600"
                                    onClick={() =>
                                        router.patch(
                                            route('gym.notifications.read', n.id),
                                        )
                                    }
                                >
                                    Mark read
                                </button>
                            )}
                            <Link
                                href={n.pathName}
                                className="text-gray-600 underline"
                            >
                                Open
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </GymLayout>
    );
}
