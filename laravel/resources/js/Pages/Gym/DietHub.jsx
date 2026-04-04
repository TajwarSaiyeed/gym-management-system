import GymLayout from '@/Layouts/GymLayout';
import { Head, Link } from '@inertiajs/react';

export default function DietHub() {
    return (
        <GymLayout title="Diet">
            <Head title="Diet" />
            <div className="flex flex-wrap gap-4">
                <Link
                    href={route('gym.diet.foods')}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow hover:border-gray-400"
                >
                    Manage foods
                </Link>
                <Link
                    href={route('gym.diet.assign')}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow hover:border-gray-400"
                >
                    Assign diet
                </Link>
            </div>
        </GymLayout>
    );
}
