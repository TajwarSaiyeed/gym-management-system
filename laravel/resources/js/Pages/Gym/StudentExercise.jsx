import GymLayout from '@/Layouts/GymLayout';
import { Head } from '@inertiajs/react';

export default function StudentExercise({ assignment }) {
    return (
        <GymLayout title="My exercise">
            <Head title="My exercise" />
            {!assignment && (
                <p className="text-gray-600">No workout assigned yet.</p>
            )}
            {assignment && (
                <div className="space-y-4 rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">
                        {assignment.fromDate} → {assignment.toDate}
                    </p>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-1 text-left">Exercise</th>
                                <th className="px-2 py-1 text-right">Sets</th>
                                <th className="px-2 py-1 text-right">Steps</th>
                                <th className="px-2 py-1 text-right">kg</th>
                                <th className="px-2 py-1 text-right">Rest</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {assignment.exercises.map((r, i) => (
                                <tr key={i}>
                                    <td className="px-2 py-1">{r.exerciseName}</td>
                                    <td className="px-2 py-1 text-right">{r.sets}</td>
                                    <td className="px-2 py-1 text-right">{r.steps}</td>
                                    <td className="px-2 py-1 text-right">{r.kg}</td>
                                    <td className="px-2 py-1 text-right">{r.rest}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </GymLayout>
    );
}
