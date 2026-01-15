import { NextResponse } from "next/server";
import { getSession } from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
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
