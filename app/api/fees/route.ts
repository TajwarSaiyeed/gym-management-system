import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import Error from "next/error";
import { Fees } from "@prisma/client";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!session) {
      redirect("/signin");
    }

    if (sessionUser.role === "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    const { email, amount, month, year, message } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feesExists = await prisma.fees.findFirst({
      where: {
        email,
        month,
        year,
      },
    });

    if (feesExists) {
      return NextResponse.json(
        {
          error: "Fees already exists",
        },
        {
          status: 400,
        }
      );
    }
    const fees = await prisma.fees.create({
      data: {
        email,
        month,
        year,
        message,
        amount,
      },
    });

    await prisma.notification.create({
      data: {
        userEmail: user.email,
        senderId: sessionUser.id,
        type: "fees",
        userId: user.id,
        notification_text: message,
        pathName: "/user/fees",
        read: false,
      },
    });

    return NextResponse.json(
      {
        data: fees,
        message: `Fees for the month of ${month} ${year} added successfully`,
      },
      {
        status: 201,
      }
    );
  } catch (err: Error | any) {
    return NextResponse.error();
  }
}

export async function GET() {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (sessionUser.role === "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const fees = await prisma?.fees.findMany();


    let income = 0;
    let unpaid = 0;

    fees.forEach((fee: Fees) => {
      if (fee.isPaid && fee.transactionId) {
        income += fee.amount
      } else {
        unpaid += fee.amount
      }
    })

    if (!fees || fees.length === 0) {
      return NextResponse.json(
        {
          fees: [],
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        fees,
        income,
        unpaid
      },
      {
        status: 200,
      }
    );
  } catch (err: Error | any) {
    return NextResponse.error();
  }
}
