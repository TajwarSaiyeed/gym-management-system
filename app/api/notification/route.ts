import Error from "next/error";
import { NextResponse } from "next/server";
import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: sessionUser.id,
        email: sessionUser.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const unRead = await prisma.notification.findMany({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return NextResponse.json(
      {
        data: notifications,
        unRead: unRead.length,
      },
      { status: 200 }
    );
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notification_text, type, userEmail, userId, senderId, pathName } =
      await req.json();

    let uEmail, uid;

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (user) {
        uEmail = user.email;
        uid = user.id;
      }
    }

    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user) {
        uEmail = user.email;
        uid = user.id;
      }
    }

    const notification = await prisma.notification.create({
      data: {
        userEmail: uEmail,
        senderId,
        type,
        userId: uid,
        notification_text,
        pathName,
        read: false,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Error creating notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
