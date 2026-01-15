import prisma from "@/app/libs/prismadb";
import { DietFood, SessionUser } from "@/types";
import { NextResponse } from "next/server";
import { getSession } from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    const sessionUser = session?.user as SessionUser;

    if (!session) {
      redirect("/signin");
    }

    if (sessionUser.role === "user") {
      return NextResponse.json(
        {
          error: "Not authorized",
        },
        { status: 403 }
      );
    }

    const { selectedStudents, dietFoodsArray, fromDate, toDate } =
      await req.json();

    if (!selectedStudents || !dietFoodsArray || !fromDate || !toDate) {
      return NextResponse.json(
        {
          error: "Missing fields",
        },
        { status: 400 }
      );
    }

    const students = await prisma.user.findMany({
      where: {
        id: {
          in: selectedStudents,
        },
      },
    });

    await Promise.all(
      students.map(async (student) => {
        const diet = await prisma.diet.findFirst({
          where: {
            studentId: student.id,
          },
        });

        if (diet) {
          await prisma.diet.update({
            where: {
              id: diet.id,
            },
            data: {
              periodWithFoodList: {
                deleteMany: {},
                create: dietFoodsArray.map((dietFood: DietFood) => ({
                  dietFoodId: dietFood.id,
                  dietFoodName: dietFood.dietFoodName,
                  breakfast: dietFood.breakfast || false,
                  morningMeal: dietFood.morningMeal || false,
                  lunch: dietFood.lunch || false,
                  eveningSnack: dietFood.eveningSnack || false,
                  dinner: dietFood.dinner || false,
                })),
              },
              fromDate: new Date(fromDate),
              toDate: new Date(toDate),
            },
          });
          await prisma.notification.create({
            data: {
              userId: student.id,
              userEmail: student.email,
              senderId: sessionUser.id,
              type: "diet",
              notification_text: "You have a new diet.",
              pathName: "/user/diet",
            }
          })
        } else {
          await prisma.diet.create({
            data: {
              studentId: student.id,
              periodWithFoodList: {
                create: dietFoodsArray.map((dietFood: DietFood) => ({
                  dietFoodId: dietFood.id,
                  dietFoodName: dietFood.dietFoodName,
                  breakfast: dietFood.breakfast || false,
                  morningMeal: dietFood.morningMeal || false,
                  lunch: dietFood.lunch || false,
                  eveningSnack: dietFood.eveningSnack || false,
                  dinner: dietFood.dinner || false,
                })),
              },
              fromDate: new Date(fromDate),
              toDate: new Date(toDate),
            },
          });
          await prisma.notification.create({
            data: {
              userId: student.id,
              userEmail: student.email,
              senderId: sessionUser.id,
              type: "diet",
              notification_text: "You have a new diet.",
              pathName: "/user/diet",
            }
          })
        }
      })
    );

    return NextResponse.json(
      {
        message: "Diet Assigned Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
  }
}
