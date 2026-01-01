import {NextRequest, NextResponse} from "next/server";
import {getSession} from "../../users/route"
import {SessionUser} from "@/types";

import prisma from "@/app/libs/prismadb"

/**
 * The  function updates the notification read 
 * status as read
 */
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
