import GymLayout from '@/Layouts/GymLayout';
import { Head, Link } from '@inertiajs/react';

export default function Trainers({ trainers }) {
    return (
        <GymLayout title="Trainers">
            <Head title="Trainers" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trainers.map((t) => (
                    <Link
                        key={t.id}
                        href={route('gym.trainers.show', t.id)}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-400"
                    >
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.email}</p>
                    </Link>
                ))}
            </div>
        </GymLayout>
    );
}
