import GymLayout from '@/Layouts/GymLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function StudentFees({ fees, summary }) {
    const errors = usePage().props.errors;

    const pay = (fee) => {
        router.post(route('gym.student.fees.checkout'), {
            feeId: fee.id,
            amount: fee.amount,
            month: fee.month,
            year: fee.year,
            description: fee.message ?? 'Fee payment',
        });
    };

    return (
        <GymLayout title="My fees">
            <Head title="My fees" />

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Paid total</p>
                    <p className="text-2xl font-semibold">${summary.paid}</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Unpaid total</p>
                    <p className="text-2xl font-semibold">${summary.unpaid}</p>
                </div>
            </div>

            <InputError message={errors?.pay} className="mb-4" />

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Period</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {fees.map((f) => (
                            <tr key={f.id}>
                                <td className="px-3 py-2">
                                    {f.month} {f.year}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    ${f.amount}
                                </td>
                                <td className="px-3 py-2">
                                    {f.isPaid ? 'Paid' : 'Unpaid'}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {!f.isPaid && (
                                        <PrimaryButton
                                            type="button"
                                            className="text-xs"
                                            onClick={() => pay(f)}
                                        >
                                            Pay with Stripe
                                        </PrimaryButton>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}
