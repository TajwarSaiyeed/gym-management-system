import GymLayout from '@/Layouts/GymLayout';
import { Head, Link } from '@inertiajs/react';

export default function Students({ students }) {
    return (
        <GymLayout title="Students">
            <Head title="Students" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((s) => (
                    <Link
                        key={s.id}
                        href={route('gym.students.show', s.id)}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-400"
                    >
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-gray-500">{s.email}</p>
                    </Link>
                ))}
            </div>
        </GymLayout>
    );
}
