import GymLayout from '@/Layouts/GymLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function StudentAttendance({ attendances }) {
    const errors = usePage().props.errors;

    return (
        <GymLayout title="My attendance">
            <Head title="My attendance" />

            <div className="mb-6">
                <PrimaryButton
                    type="button"
                    onClick={() =>
                        router.post(route('gym.student.attendance.mark'))
                    }
                >
                    Mark today (if window open)
                </PrimaryButton>
                <InputError message={errors?.mark} className="mt-2" />
            </div>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Window</th>
                            <th className="px-3 py-2 text-left">Present</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {attendances.map((a) => (
                            <tr key={a.id}>
                                <td className="px-3 py-2">{a.date}</td>
                                <td className="px-3 py-2">
                                    {a.fromTime}–{a.toTime}
                                </td>
                                <td className="px-3 py-2">
                                    {a.isPresent ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}
