import GymLayout from '@/Layouts/GymLayout';
import { Head } from '@inertiajs/react';

export default function StudentDiet({ diet }) {
    return (
        <GymLayout title="My diet">
            <Head title="My diet" />
            {!diet && (
                <p className="text-gray-600">No diet sheet assigned yet.</p>
            )}
            {diet && (
                <div className="space-y-4 rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">
                        {diet.fromDate} → {diet.toDate}
                    </p>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-1 text-left">Food</th>
                                <th className="px-2 py-1">B</th>
                                <th className="px-2 py-1">AM</th>
                                <th className="px-2 py-1">L</th>
                                <th className="px-2 py-1">ES</th>
                                <th className="px-2 py-1">D</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {diet.periods.map((p, i) => (
                                <tr key={i}>
                                    <td className="px-2 py-1">{p.dietFoodName}</td>
                                    <td className="text-center">{p.breakfast ? '✓' : ''}</td>
                                    <td className="text-center">{p.morningMeal ? '✓' : ''}</td>
                                    <td className="text-center">{p.lunch ? '✓' : ''}</td>
                                    <td className="text-center">{p.eveningSnack ? '✓' : ''}</td>
                                    <td className="text-center">{p.dinner ? '✓' : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </GymLayout>
    );
}
