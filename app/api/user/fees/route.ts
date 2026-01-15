import prisma from "@/app/libs/prismadb";
import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (sessionUser.role !== "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const fees = await prisma.fees.findMany({
      where: {
        email: sessionUser.email,
      },
    });

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
    let paid = 0;
    let unpaid = 0

    fees.forEach((fee) => {
      if (fee.isPaid) {
        paid += fee.amount
      } else {
        unpaid += fee.amount
      }
    })

    return NextResponse.json(
      {
        fees,
        paid,
        unpaid
      },
      {
        status: 200,
      }
    );
  } catch (err: Error | any) {
  }
}
