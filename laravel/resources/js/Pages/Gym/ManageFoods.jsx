import GymLayout from '@/Layouts/GymLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';

export default function ManageFoods({ foods }) {
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.diet.foods.store'), { onSuccess: () => reset() });
    };

    const remove = (id) => {
        if (confirm('Delete food?')) {
            router.delete(route('gym.diet.foods.destroy'), { data: { id } });
        }
    };

    return (
        <GymLayout title="Foods">
            <Head title="Foods" />
            <form
                onSubmit={submit}
                className="mb-8 flex max-w-md gap-2 rounded-xl bg-white p-4 shadow"
            >
                <div className="flex-1">
                    <InputLabel value="Food name" />
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </div>
                <div className="self-end">
                    <PrimaryButton type="submit" disabled={processing}>
                        Add
                    </PrimaryButton>
                </div>
            </form>
            <ul className="divide-y rounded-xl bg-white shadow">
                {foods.map((f) => (
                    <li
                        key={f.id}
                        className="flex items-center justify-between px-4 py-3"
                    >
                        <span>{f.name}</span>
                        <button
                            type="button"
                            className="text-sm text-red-600"
                            onClick={() => remove(f.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </GymLayout>
    );
}
