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

    const foods = await prisma.dietFoodList.findMany();

    if (!foods || foods.length === 0) {
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
        data: foods,
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
          error: "Invalid food name",
        },
        {
          status: 400,
        }
      );
    }

    const foodExists = await prisma.dietFoodList.findFirst({
      where: { name },
    });

    if (foodExists) {
      return NextResponse.json(
        {
          error: "Food already exists",
        },
        {
          status: 400,
        }
      );
    }

    const food = await prisma.dietFoodList.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: food,
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

    const foodExist = await prisma.dietFoodList.findFirst({
      where: {
        id,
      },
    });

    if (!foodExist) {
      return NextResponse.json(
        {
          error: "Food does not exist",
        },
        {
          status: 400,
        }
      );
    }
    const deleteFood = await prisma.dietFoodList.delete({
      where: { id },
    });

    if (!deleteFood) {
      return NextResponse.json(
        {
          error: "Food could not be deleted",
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
        data: deleteFood,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error, status: false });
  }
}
