import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/actions/getCurrentUser"
import {SessionUser} from "@/types";

import prisma from "@/app/libs/prismadb"

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        const sessionUser = session?.user as SessionUser

        if (!session) {
            return NextResponse.json({
                error: "Unauthenticated"
            }, {
                status: 401
            })
        }

        const notificationId = req.nextUrl.pathname.split("/").at(-1);

        const notif = await prisma.notification.update({
            where: {
                id: notificationId
            }, data: {
                read: true
            }
        })

        if (!notif) {
            return NextResponse.json({error: "Something went wrong"}, {
                status: 500
            })
        }

        return NextResponse.json({message: "Mark as read"}, {
            status: 201
        })
    } catch (err: Error | any) {
        return NextResponse.json({
            error: err.message
        }, {
            status: err.status
        })
    }

}
