import { SessionUser } from "@/types";
import { getSession } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const exercises = await prisma.exerciseList.findMany();

    if (!exercises || exercises.length === 0) {
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
        status: "success",
        data: exercises,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error, status: false });
  }
}
export async function POST(req: Request) {
  try {
    const session = await getSession();

    const sessionUser = session?.user as SessionUser;

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    if (sessionUser.role === "user") {
      return NextResponse.json(
        {
          error: "Not authorized",
        },
        { status: 403 }
      );
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          error: "Invalid exercise name",
        },
        {
          status: 400,
        }
      );
    }

    const exerciseExists = await prisma.exerciseList.findFirst({
      where: { name },
    });

    if (exerciseExists) {
      return NextResponse.json(
        {
          error: "Exercise already exists",
        },
        {
          status: 400,
        }
      );
    }

    const exercise = await prisma.exerciseList.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: exercise,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error, status: false });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();

    const sessionUser = session?.user as SessionUser;

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    if (sessionUser.role === "user") {
      return NextResponse.json(
        {
          error: "Not authorized",
        },
        { status: 403 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          error: "Invalid Id",
        },
        {
          status: 400,
        }
      );
    }

    const exerciseExist = await prisma.exerciseList.findFirst({
      where: {
        id,
      },
    });

    if (!exerciseExist) {
      return NextResponse.json(
        {
          error: "Exercise does not exist",
        },
        {
          status: 400,
        }
      );
    }
    const deleteExercise = await prisma.exerciseList.delete({
      where: { id },
    });

    if (!deleteExercise) {
      return NextResponse.json(
        {
          error: "Exercise could not be deleted",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Exercise deleted successfully",
        data: deleteExercise,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error, status: false });
  }
}
