import AttendanceChart from '@/Components/AttendanceChart';
import GymLayout from '@/Layouts/GymLayout';
import { Head, router, usePage } from '@inertiajs/react';

function Stat({ label, value }) {
    return (
        <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}

export default function StudentDashboard({ feesSummary, attendances }) {
    const user = usePage().props.auth?.user;
    const presence = user?.isActive ? 'online' : 'offline';

    return (
        <GymLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    Hi, {user?.name}
                </h2>
                <select
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={presence}
                    onChange={(e) => {
                        router.patch(route('presence.update'), {
                            status: e.target.value,
                        });
                    }}
                >
                    <option value="online">🟢 Online</option>
                    <option value="offline">🔴 Offline</option>
                </select>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <Stat label="Paid" value={`$${feesSummary.paid}`} />
                <Stat label="Unpaid" value={`$${feesSummary.unpaid}`} />
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
                <AttendanceChart attendanceData={attendances} />
            </div>
        </GymLayout>
    );
}
