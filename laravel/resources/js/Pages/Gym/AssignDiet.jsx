import GymLayout from '@/Layouts/GymLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function AssignDiet({ students, foods }) {
    const { data, setData, post, processing } = useForm({
        selectedStudents: [],
        fromDate: '',
        toDate: '',
        dietFoodsArray: foods.map((f) => ({
            id: f.id,
            dietFoodName: f.name,
            breakfast: false,
            morningMeal: false,
            lunch: false,
            eveningSnack: false,
            dinner: false,
        })),
    });

    const toggleStudent = (id) => {
        const cur = data.selectedStudents;
        setData(
            'selectedStudents',
            cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        );
    };

    const toggleMeal = (index, field) => {
        const arr = [...data.dietFoodsArray];
        arr[index] = { ...arr[index], [field]: !arr[index][field] };
        setData('dietFoodsArray', arr);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.diet.assign.store'));
    };

    return (
        <GymLayout title="Assign diet">
            <Head title="Assign diet" />
            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-xl bg-white p-4 shadow">
                    <InputLabel value="Students" />
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {students.map((s) => (
                            <label key={s.id} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.selectedStudents.includes(
                                        s.id,
                                    )}
                                    onChange={() => toggleStudent(s.id)}
                                />
                                {s.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value="From" />
                        <TextInput
                            type="date"
                            value={data.fromDate}
                            onChange={(e) =>
                                setData('fromDate', e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <InputLabel value="To" />
                        <TextInput
                            type="date"
                            value={data.toDate}
                            onChange={(e) => setData('toDate', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl bg-white shadow">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-left">Food</th>
                                <th className="px-1 py-2">B</th>
                                <th className="px-1 py-2">AM</th>
                                <th className="px-1 py-2">L</th>
                                <th className="px-1 py-2">ES</th>
                                <th className="px-1 py-2">D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dietFoodsArray.map((row, i) => (
                                <tr key={row.id} className="border-t">
                                    <td className="px-2 py-2">{row.dietFoodName}</td>
                                    {['breakfast', 'morningMeal', 'lunch', 'eveningSnack', 'dinner'].map(
                                        (field) => (
                                            <td key={field} className="text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={row[field]}
                                                    onChange={() =>
                                                        toggleMeal(i, field)
                                                    }
                                                />
                                            </td>
                                        ),
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PrimaryButton disabled={processing}>Assign diet</PrimaryButton>
            </form>
        </GymLayout>
    );
}
