import GymLayout from '@/Layouts/GymLayout';
import { Head } from '@inertiajs/react';

export default function TrainerShow({ trainer }) {
    return (
        <GymLayout title={trainer.name}>
            <Head title={trainer.name} />
            <div className="max-w-xl rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold">{trainer.name}</h2>
                <p className="text-gray-600">{trainer.email}</p>
                <dl className="mt-4 space-y-1 text-sm">
                    <dt className="text-gray-500">Gender</dt>
                    <dd>{trainer.gender}</dd>
                    <dt className="text-gray-500">Age</dt>
                    <dd>{trainer.age}</dd>
                </dl>
            </div>
        </GymLayout>
    );
}
