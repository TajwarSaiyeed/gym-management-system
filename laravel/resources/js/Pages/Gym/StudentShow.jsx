import GymLayout from '@/Layouts/GymLayout';
import { Head } from '@inertiajs/react';

export default function StudentShow({ student }) {
    return (
        <GymLayout title={student.name}>
            <Head title={student.name} />
            <div className="max-w-xl rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-gray-600">{student.email}</p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <dt className="text-gray-500">Gender</dt>
                        <dd>{student.gender}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Age</dt>
                        <dd>{student.age}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Goal</dt>
                        <dd>{student.goal}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Level</dt>
                        <dd>{student.level}</dd>
                    </div>
                </dl>
            </div>
        </GymLayout>
    );
}
