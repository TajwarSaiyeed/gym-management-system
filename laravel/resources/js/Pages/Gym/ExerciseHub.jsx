import GymLayout from '@/Layouts/GymLayout';
import { Head, Link } from '@inertiajs/react';

export default function ExerciseHub() {
    return (
        <GymLayout title="Exercise">
            <Head title="Exercise" />
            <div className="flex flex-wrap gap-4">
                <Link
                    href={route('gym.exercise.manage')}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow hover:border-gray-400"
                >
                    Manage exercise library
                </Link>
                <Link
                    href={route('gym.exercise.assign')}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow hover:border-gray-400"
                >
                    Assign workout
                </Link>
            </div>
        </GymLayout>
    );
}
