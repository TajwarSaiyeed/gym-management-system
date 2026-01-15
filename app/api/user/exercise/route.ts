import { NextResponse } from "next/server";
import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import prisma from "@/app/libs/prismadb";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!session) {
      redirect("/signin");
    }

    if (sessionUser.role !== "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const exercises = await prisma.exercise.findFirst({
      where: {
        studentId: sessionUser?.id,
      },
      include: {
        exercises: true,
      },
    });

    if (!exercises) {
      return NextResponse.json(
        {
          title: "No exercises found",
          subTitle: "You have not submitted any exercises yet.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: exercises,
      },
      { status: 200 }
    );
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
