import { NextResponse } from "next/server";
import { SessionUser } from "@/types";
import { getSession } from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        const sessionUser = session?.user as SessionUser;

        if (!session) {
            redirect("/signin");
        }

        if (sessionUser.role === "user") {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 403,
                }
            );
        }

        const { fromTime, toTime } = await req.json();

        if (fromTime === "" || toTime === "") {
            return NextResponse.json(
                { error: "Missing fields" },
                {
                    status: 400,
                }
            );
        }

        const toDate = (timeString: string) => {
            const now = new Date();
            const [hours, minutes] = timeString.split(":");

            now.setHours(Number(hours));
            now.setMinutes(Number(minutes));

            return now;
        };

        const fTime = toDate(fromTime);
        const tTime = toDate(toTime);

        if (tTime <= fTime) {
            return NextResponse.json(
                {
                    error: "To can't be less than or equal to From Time",
                },
                {
                    status: 400,
                }
            );
        }
        const toDay = new Date().toISOString().split("T")[0];

        const findAttendance = await prisma.attendance.findMany({
            where: {
                date: toDay,
            },
        });

        if (findAttendance.length > 0) {
            return NextResponse.json(
                {
                    error: "Attendance already taken",
                },
                {
                    status: 400,
                }
            );
        }

        const students = await prisma.user.findMany({
            where: {
                role: "user",
            },
        });

        const attendance = await prisma.attendance.createMany({
            data: students.map((student: User) => ({
                studentId: student.id,
                date: toDay,
                fromTime: fromTime,
                toTime: toTime,
                isPresent: false,
            })),
        });

        if (!attendance) {
            return NextResponse.json(
                {
                    error: "Attendance not taken",
                },
                {
                    status: 400,
                }
            );
        }

        await prisma.notification.createMany({
            data: students.map((student: User) => ({
                userId: student.id,
                userEmail: student.email,
                senderId: sessionUser.id,
                notification_text: "Are you available for today?",
                pathName: "/user/attendance",
                read: false,
                type: "present"
            }))
        })

        return NextResponse.json(
            {
                message: "Attendance taken successfully",
            },
            {
                status: 201,
            }
        );
    } catch (err: Error | any) {
        return NextResponse.json(
            {
                error: err.message,
            },
            {
                status: err.status,
            }
        );
    }
}

export async function GET() {
    try {
        const session = await getSession();
        const sessionUser = session?.user as SessionUser;

        if (!session) {
            redirect("/signin");
        }

        if (sessionUser.role === "user") {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 403,
                }
            );
        }

        const attendances = await prisma.attendance.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!attendances || attendances.length === 0) {
            return NextResponse.json(
                {
                    data: [],
                },
                {
                    status: 200,
                }
            );
        }

        return NextResponse.json(
            {
                data: attendances,
            },
            {
                status: 200,
            }
        );
    } catch (err: Error | any) {
        return NextResponse.json(
            {
                error: err.message,
            },
            {
                status: err.status,
            }
        );
    }
}
