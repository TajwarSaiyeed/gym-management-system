import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function NavItem({ href, children }) {
    const { url } = usePage();
    const active = url === href || url.startsWith(`${href}/`);
    return (
        <Link
            href={href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            {children}
        </Link>
    );
}

export default function GymLayout({ title, children }) {
    const { auth, notificationBell, flash } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const role = user?.role;

    const markRead = (id) => {
        router.patch(
            route('gym.notifications.read', id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <aside
                    className={`${
                        open ? 'w-60' : 'w-16'
                    } shrink-0 border-r border-gray-200 bg-white transition-all`}
                >
                    <div className="flex h-14 items-center justify-between border-b border-gray-100 px-3">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ApplicationLogo className="h-8 w-8 fill-current text-gray-800" />
                            {open && (
                                <span className="text-sm font-semibold">
                                    Gym
                                </span>
                            )}
                        </Link>
                    </div>
                    <nav className="space-y-1 p-2 text-sm">
                        <NavItem href={route('dashboard')}>
                            {open && 'Dashboard'}
                            {!open && '⌂'}
                        </NavItem>

                        {(role === 'admin' || role === 'trainer') && (
                            <>
                                <NavItem href={route('gym.add-user')}>
                                    {open && 'Add user'}
                                    {!open && '+'}
                                </NavItem>
                                {role === 'admin' && (
                                    <NavItem href={route('gym.manage-user')}>
                                        {open && 'Manage users'}
                                        {!open && '⚙'}
                                    </NavItem>
                                )}
                            </>
                        )}

                        <NavItem href={route('gym.trainers')}>
                            {open && 'Trainers'}
                            {!open && 'T'}
                        </NavItem>

                        {(role === 'admin' || role === 'trainer') && (
                            <>
                                <NavItem href={route('gym.students')}>
                                    {open && 'Students'}
                                    {!open && 'S'}
                                </NavItem>
                                <NavItem href={route('gym.attendance')}>
                                    {open && 'Attendance'}
                                    {!open && 'A'}
                                </NavItem>
                            </>
                        )}

                        {(role === 'admin' || role === 'trainer') && (
                            <>
                                <div
                                    className={`pt-2 text-xs font-semibold uppercase text-gray-400 ${!open ? 'hidden' : ''}`}
                                >
                                    Manage
                                </div>
                                <NavItem href={route('gym.fees')}>
                                    {open && 'Fees'}
                                    {!open && '$'}
                                </NavItem>
                                <NavItem href={route('gym.exercise')}>
                                    {open && 'Exercise'}
                                    {!open && 'E'}
                                </NavItem>
                                <NavItem href={route('gym.diet')}>
                                    {open && 'Diet'}
                                    {!open && 'D'}
                                </NavItem>
                            </>
                        )}

                        {role === 'user' && (
                            <>
                                <NavItem href={route('gym.student.attendance')}>
                                    {open && 'My attendance'}
                                    {!open && 'a'}
                                </NavItem>
                                <NavItem href={route('gym.student.fees')}>
                                    {open && 'My fees'}
                                    {!open && 'f'}
                                </NavItem>
                                <NavItem href={route('gym.student.exercise')}>
                                    {open && 'My exercise'}
                                    {!open && 'e'}
                                </NavItem>
                                <NavItem href={route('gym.student.diet')}>
                                    {open && 'My diet'}
                                    {!open && 'd'}
                                </NavItem>
                            </>
                        )}
                    </nav>
                    <div className="p-2">
                        <button
                            type="button"
                            onClick={() => setOpen(!open)}
                            className="w-full rounded border border-gray-200 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                            {open ? 'Collapse' : '»'}
                        </button>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {title ?? 'Gym'}
                        </h1>
                        <div className="flex items-center gap-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        🔔
                                        {notificationBell?.unread > 0 && (
                                            <span className="absolute right-0 top-0 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                                                {notificationBell.unread}
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="64">
                                    {notificationBell?.items?.length === 0 && (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                            No new notifications
                                        </div>
                                    )}
                                    {notificationBell?.items?.map((n) => (
                                        <Link
                                            key={n.id}
                                            href={n.pathName}
                                            className="block px-3 py-2 text-sm hover:bg-gray-50"
                                            onClick={() => markRead(n.id)}
                                        >
                                            {n.notification_text.slice(0, 48)}
                                            …
                                        </Link>
                                    ))}
                                    <Link
                                        href={route('gym.notifications')}
                                        className="block border-t px-3 py-2 text-center text-sm text-indigo-600"
                                    >
                                        View all
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm text-gray-700"
                                        >
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs">
                                                {user?.name?.charAt(0)}
                                            </span>
                                            {user?.name}
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </header>

                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
