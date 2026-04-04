import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function AttendanceChart({ attendanceData = [] }) {
    const timeSlots = [];
    attendanceData.forEach((a) => {
        if (!timeSlots.includes(a.date)) {
            timeSlots.push(a.date);
        }
    });

    const chartData = timeSlots.map((timeSlot) => {
        const present = attendanceData.filter(
            (a) => a.isPresent && a.date === timeSlot,
        ).length;
        const absent = attendanceData.filter(
            (a) => !a.isPresent && a.date === timeSlot,
        ).length;
        return { timeSlot, present, absent };
    });

    return (
        <div className="h-64 w-full">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
                Attendance graph
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSlot" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="present"
                        name="Present"
                        fill="rgba(75, 192, 192, 0.8)"
                    />
                    <Bar
                        dataKey="absent"
                        name="Absent"
                        fill="rgba(255, 99, 132, 0.8)"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
