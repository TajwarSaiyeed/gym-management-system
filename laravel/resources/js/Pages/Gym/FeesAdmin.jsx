import GymLayout from '@/Layouts/GymLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default function FeesAdmin({ fees, summary, students }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        amount: 50,
        month: 'January',
        year: new Date().getFullYear().toString(),
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.fees.store'));
    };

    return (
        <GymLayout title="Fees">
            <Head title="Fees" />

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Income</p>
                    <p className="text-2xl font-semibold">${summary.income}</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <p className="text-2xl font-semibold">${summary.unpaid}</p>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="mb-8 grid max-w-2xl gap-4 rounded-xl bg-white p-4 shadow sm:grid-cols-2"
            >
                <div className="sm:col-span-2">
                    <InputLabel value="Student" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    >
                        <option value="">Select…</option>
                        {students.map((s) => (
                            <option key={s.id} value={s.email}>
                                {s.name} ({s.email})
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.email} />
                </div>
                <div>
                    <InputLabel value="Amount (USD)" />
                    <TextInput
                        type="number"
                        value={data.amount}
                        onChange={(e) => setData('amount', +e.target.value)}
                        required
                    />
                </div>
                <div>
                    <InputLabel value="Month" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300"
                        value={data.month}
                        onChange={(e) => setData('month', e.target.value)}
                    >
                        {months.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <InputLabel value="Year" />
                    <TextInput
                        value={data.year}
                        onChange={(e) => setData('year', e.target.value)}
                    />
                </div>
                <div className="sm:col-span-2">
                    <InputLabel value="Message" />
                    <TextInput
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                    />
                </div>
                <div>
                    <PrimaryButton disabled={processing}>Add fee</PrimaryButton>
                </div>
                <InputError message={errors.month} />
            </form>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Email</th>
                            <th className="px-3 py-2 text-left">Period</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2 text-left">Paid</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {fees.map((f) => (
                            <tr key={f.id}>
                                <td className="px-3 py-2">{f.email}</td>
                                <td className="px-3 py-2">
                                    {f.month} {f.year}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    ${f.amount}
                                </td>
                                <td className="px-3 py-2">
                                    {f.isPaid ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}
