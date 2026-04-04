import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GymLayout from '@/Layouts/GymLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const goals = [
    'gain_weight',
    'lose_weight',
    'get_fitter',
    'get_stronger',
    'get_healthier',
    'get_more_flexible',
    'get_more_muscular',
    'learn_the_basics',
];

const levels = [
    'beginner',
    'intermediate',
    'advanced',
    'expert',
    'professional',
];

export default function AddMember({ trainers }) {
    const role = usePage().props.auth.user?.role;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        image: '',
        role: role === 'admin' ? 'trainer' : 'user',
        gender: 'male',
        age: 18,
        weight: 50,
        height: 100,
        goal: 'lose_weight',
        level: 'beginner',
        trainerId: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gym.add-user.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <GymLayout title="Add user">
            <Head title="Add user" />

            <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">Add member</h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel value="Role" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            {role === 'admin' && (
                                <>
                                    <option value="trainer">Trainer</option>
                                    <option value="user">Student</option>
                                </>
                            )}
                            {role === 'trainer' && (
                                <option value="user">Student</option>
                            )}
                        </select>
                        <InputError message={errors.role} />
                    </div>
                    {role === 'admin' && data.role === 'user' && (
                        <div>
                            <InputLabel value="Assign trainer (optional)" />
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300"
                                value={data.trainerId}
                                onChange={(e) =>
                                    setData('trainerId', e.target.value)
                                }
                            >
                                <option value="">—</option>
                                {trainers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div>
                        <InputLabel value="Gender" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <InputLabel value="Age" />
                            <TextInput
                                type="number"
                                value={data.age}
                                onChange={(e) =>
                                    setData('age', +e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <InputLabel value="Height" />
                            <TextInput
                                type="number"
                                value={data.height}
                                onChange={(e) =>
                                    setData('height', +e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <InputLabel value="Weight" />
                            <TextInput
                                type="number"
                                value={data.weight}
                                onChange={(e) =>
                                    setData('weight', +e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel value="Goal" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300"
                            value={data.goal}
                            onChange={(e) => setData('goal', e.target.value)}
                        >
                            {goals.map((g) => (
                                <option key={g} value={g}>
                                    {g.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Level" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300"
                            value={data.level}
                            onChange={(e) => setData('level', e.target.value)}
                        >
                            {levels.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Image URL (optional)" />
                        <TextInput
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        <Link
                            href={route('gym.trainers')}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}
