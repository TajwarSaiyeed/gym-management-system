import GymLayout from '@/Layouts/GymLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';

export default function ManageExercise({ exercises }) {
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.exercise.manage.store'), {
            onSuccess: () => reset(),
        });
    };

    const remove = (id) => {
        if (confirm('Delete this exercise?')) {
            router.delete(route('gym.exercise.manage.destroy'), {
                data: { id },
            });
        }
    };

    return (
        <GymLayout title="Exercise library">
            <Head title="Manage exercises" />
            <form
                onSubmit={submit}
                className="mb-8 flex max-w-md gap-2 rounded-xl bg-white p-4 shadow"
            >
                <div className="flex-1">
                    <InputLabel value="Name" />
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </div>
                <div className="self-end">
                    <PrimaryButton disabled={processing}>Add</PrimaryButton>
                </div>
            </form>
            <ul className="divide-y rounded-xl bg-white shadow">
                {exercises.map((ex) => (
                    <li
                        key={ex.id}
                        className="flex items-center justify-between px-4 py-3"
                    >
                        <span>{ex.name}</span>
                        <button
                            type="button"
                            className="text-sm text-red-600"
                            onClick={() => remove(ex.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </GymLayout>
    );
}
