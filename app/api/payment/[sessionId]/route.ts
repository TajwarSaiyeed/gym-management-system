import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/app/actions/getCurrentUser";
import { SessionUser } from "@/types";
import prisma from "@/app/libs/prismadb";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (sessionUser.role !== "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const sessionId = req.nextUrl.pathname.split("/")[3];

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session id" },
        { status: 400 }
      );
    }

    if (!sessionId.startsWith("cs_")) {
      throw new Error("Invalid session id");
    }

    const checkoutSession = (await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["payment_intent"],
      }
    )) as Stripe.Checkout.Session;

    if (checkoutSession.customer_email !== sessionUser.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const feeExist = await prisma.fees.findUnique({
      where: {
        id: checkoutSession.client_reference_id as string,
      },
    });

    if (!feeExist) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    if (feeExist.isPaid) {
      return NextResponse.json({ error: "Fee already paid" }, { status: 400 });
    }

    if (checkoutSession.payment_status === "paid") {
      const feeUpdate = await prisma.fees.update({
        where: {
          id: checkoutSession.client_reference_id as string,
        },
        data: {
          isPaid: true,
          transactionId: (
            checkoutSession?.payment_intent as Stripe.PaymentIntent
          )?.id!,
          paymentDate: new Date(checkoutSession.created * 1000),
        },
      });

      return NextResponse.json(
        {
          checkoutSession,
          feeUpdate,
        },
        { status: 200 }
      );
    }
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
