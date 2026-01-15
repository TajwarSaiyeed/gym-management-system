import {NextResponse} from "next/server";

import {SessionUser} from "@/types";
import {getSession} from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";


export async function GET(req: Request) {
    try {
        const session = await getSession()
        const sessionUser = session?.user as SessionUser

        if (!session && !sessionUser.email) {
            return NextResponse.json({
                error: "Not authenticated"
            }, {
                status: 401,
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: sessionUser?.email
            },
        })

        if (!user) {
            return NextResponse.json({
                error: "No user found"
            }, {
                status: 400
            })
        }

        user.hashedPassword = null as unknown as any;

        return NextResponse.json({
            data: user
        }, {
            status: 200
        })
    } catch (err: Error | any) {
        return NextResponse.json({
            error: "Something went wrong!!!"
        }, {
            status: 500
        })
    }
}
