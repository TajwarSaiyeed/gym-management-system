import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            image: user.image ?? '',
            age: user.age ?? 18,
            weight: user.weight ?? 50,
            height: user.height ?? 100,
            goal: user.goal ?? 'lose_weight',
            level: user.level ?? 'beginner',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your profile. Email and role are fixed for this
                    account.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="email_ro" value="Email" />
                    <TextInput
                        id="email_ro"
                        type="email"
                        className="mt-1 block w-full bg-gray-50"
                        value={user.email}
                        readOnly
                    />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="image" value="Image URL" />
                    <TextInput
                        id="image"
                        className="mt-1 block w-full"
                        value={data.image}
                        onChange={(e) => setData('image', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.image} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <InputLabel value="Age" />
                        <TextInput
                            type="number"
                            value={data.age}
                            onChange={(e) => setData('age', +e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.age} />
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
                        <InputError className="mt-2" message={errors.height} />
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
                        <InputError className="mt-2" message={errors.weight} />
                    </div>
                </div>

                <div>
                    <InputLabel value="Goal" />
                    <TextInput
                        value={data.goal}
                        onChange={(e) => setData('goal', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.goal} />
                </div>

                <div>
                    <InputLabel value="Level" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.level}
                        onChange={(e) => setData('level', e.target.value)}
                    >
                        {[
                            'beginner',
                            'intermediate',
                            'advanced',
                            'expert',
                            'professional',
                        ].map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.level} />
                </div>

                {status === 'profile-updated' && (
                    <p className="text-sm text-green-600">Saved.</p>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
