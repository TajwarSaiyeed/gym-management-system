import { NextResponse } from "next/server";
import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import prisma from "@/app/libs/prismadb";

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

    const diets = await prisma.diet.findFirst({
      where: {
        studentId: sessionUser?.id,
      },
      include: {
        periodWithFoodList: true,
      },
    });

    if (!diets) {
      return NextResponse.json(
        {
          title: "No diets found",
          subTitle: "You have not submitted any diets yet.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: diets,
      },
      { status: 200 }
    );
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
