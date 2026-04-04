import GymLayout from '@/Layouts/GymLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function AttendanceAdmin({ attendances }) {
    const { data, setData, post, processing, errors } = useForm({
        fromTime: '09:00',
        toTime: '17:00',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.attendance.store'));
    };

    return (
        <GymLayout title="Attendance">
            <Head title="Attendance" />

            <form
                onSubmit={submit}
                className="mb-8 flex max-w-md flex-wrap items-end gap-4 rounded-xl bg-white p-4 shadow"
            >
                <div>
                    <InputLabel value="From" />
                    <TextInput
                        type="time"
                        value={data.fromTime}
                        onChange={(e) => setData('fromTime', e.target.value)}
                    />
                    <InputError message={errors.fromTime} />
                </div>
                <div>
                    <InputLabel value="To" />
                    <TextInput
                        type="time"
                        value={data.toTime}
                        onChange={(e) => setData('toTime', e.target.value)}
                    />
                    <InputError message={errors.toTime} />
                </div>
                <InputError message={errors.time} />
                <PrimaryButton disabled={processing}>Take today</PrimaryButton>
            </form>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Student</th>
                            <th className="px-3 py-2 text-left">Window</th>
                            <th className="px-3 py-2 text-left">Present</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {attendances.map((a) => (
                            <tr key={a.id}>
                                <td className="px-3 py-2">{a.date}</td>
                                <td className="px-3 py-2">
                                    {a.student?.name ?? '—'}
                                </td>
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
