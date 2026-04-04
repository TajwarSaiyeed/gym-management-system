import GymLayout from '@/Layouts/GymLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function AssignExercise({ students, exerciseCatalog }) {
    const { data, setData, post, processing } = useForm({
        selectedStudents: [],
        fromDate: '',
        toDate: '',
        workOutArray: [
            {
                id: '',
                exerciseName: '',
                sets: 3,
                steps: 8,
                kg: 20,
                rest: 60,
            },
        ],
    });

    const toggleStudent = (id) => {
        const cur = data.selectedStudents;
        setData(
            'selectedStudents',
            cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        );
    };

    const addRow = () => {
        setData('workOutArray', [
            ...data.workOutArray,
            {
                id: '',
                exerciseName: '',
                sets: 3,
                steps: 8,
                kg: 20,
                rest: 60,
            },
        ]);
    };

    const updateRow = (i, field, value) => {
        const rows = [...data.workOutArray];
        rows[i] = { ...rows[i], [field]: value };
        if (field === 'id') {
            const ex = exerciseCatalog.find((e) => e.id === value);
            rows[i].exerciseName = ex ? ex.name : '';
        }
        setData('workOutArray', rows);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.exercise.assign.store'));
    };

    return (
        <GymLayout title="Assign workout">
            <Head title="Assign workout" />
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

                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">Exercises</h3>
                        <button
                            type="button"
                            className="text-sm text-indigo-600"
                            onClick={addRow}
                        >
                            + Row
                        </button>
                    </div>
                    {data.workOutArray.map((row, i) => (
                        <div
                            key={i}
                            className="mb-4 grid gap-2 border-b border-gray-100 pb-4 sm:grid-cols-6"
                        >
                            <select
                                className="rounded border border-gray-300 text-sm sm:col-span-2"
                                value={row.id}
                                onChange={(e) =>
                                    updateRow(i, 'id', e.target.value)
                                }
                            >
                                <option value="">Pick exercise…</option>
                                {exerciseCatalog.map((ex) => (
                                    <option key={ex.id} value={ex.id}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>
                            <TextInput
                                type="number"
                                className="text-sm"
                                placeholder="Sets"
                                value={row.sets}
                                onChange={(e) =>
                                    updateRow(i, 'sets', +e.target.value)
                                }
                            />
                            <TextInput
                                type="number"
                                className="text-sm"
                                placeholder="Steps"
                                value={row.steps}
                                onChange={(e) =>
                                    updateRow(i, 'steps', +e.target.value)
                                }
                            />
                            <TextInput
                                type="number"
                                className="text-sm"
                                placeholder="kg"
                                value={row.kg}
                                onChange={(e) =>
                                    updateRow(i, 'kg', +e.target.value)
                                }
                            />
                            <TextInput
                                type="number"
                                className="text-sm"
                                placeholder="Rest s"
                                value={row.rest}
                                onChange={(e) =>
                                    updateRow(i, 'rest', +e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>

                <PrimaryButton disabled={processing}>Assign</PrimaryButton>
            </form>
        </GymLayout>
    );
}
