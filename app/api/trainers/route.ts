import { NextResponse } from "next/server";
import { SessionUser } from "@/types";
import { getSession } from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  const sessionUser = session?.user as SessionUser;

  if (!sessionUser?.email) {
    return NextResponse.json(
      {
        error: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const users = await prisma.user.findMany({
    where: {
      role: "trainer",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      age: true,
      gender: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!users || users.length === 0) {
    return NextResponse.json({
      status: 200,
      data: [],
    });
  }

  return NextResponse.json({
    status: 200,
    data: users,
  });
}
