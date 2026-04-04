import GymLayout from '@/Layouts/GymLayout';
import { Head, Link } from '@inertiajs/react';

export default function FeePaymentSuccess({ fee }) {
    return (
        <GymLayout title="Payment success">
            <Head title="Payment success" />
            <div className="max-w-lg rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-green-700">Payment successful</h2>
                <p className="mt-2 text-gray-600">
                    {fee.month} {fee.year} — ${fee.amount}
                </p>
                <Link
                    href={route('gym.student.fees')}
                    className="mt-4 inline-block text-indigo-600 underline"
                >
                    Back to fees
                </Link>
            </div>
        </GymLayout>
    );
}
