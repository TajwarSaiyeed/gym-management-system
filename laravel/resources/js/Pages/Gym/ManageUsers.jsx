import GymLayout from '@/Layouts/GymLayout';
import { Head, router } from '@inertiajs/react';

export default function ManageUsers({ userList, trainers }) {
    const { meta, data } = userList;

    const go = (p) => {
        router.get(route('gym.manage-user'), { page: p, per_page: meta.per_page });
    };

    return (
        <GymLayout title="Manage users">
            <Head title="Manage users" />

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Trainer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((u) => (
                            <tr key={u.id}>
                                <td className="px-4 py-2">{u.name}</td>
                                <td className="px-4 py-2">{u.email}</td>
                                <td className="px-4 py-2">{u.role}</td>
                                <td className="px-4 py-2">
                                    {u.role === 'user' && (
                                        <select
                                            className="rounded border border-gray-300 text-xs"
                                            defaultValue={u.trainerId ?? ''}
                                            onChange={(e) => {
                                                router.patch(
                                                    route(
                                                        'gym.manage-user.trainer',
                                                    ),
                                                    {
                                                        userId: u.id,
                                                        trainerId: e.target.value,
                                                    },
                                                );
                                            }}
                                        >
                                            <option value="">—</option>
                                            {trainers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
                    <button
                        type="button"
                        disabled={meta.current_page <= 1}
                        className="rounded border px-2 py-1 disabled:opacity-40"
                        onClick={() => go(meta.current_page - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {meta.current_page} / {meta.last_page}
                    </span>
                    <button
                        type="button"
                        disabled={meta.current_page >= meta.last_page}
                        className="rounded border px-2 py-1 disabled:opacity-40"
                        onClick={() => go(meta.current_page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </GymLayout>
    );
}
