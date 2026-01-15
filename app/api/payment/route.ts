import { SessionUser } from "@/types";
import { getSession } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const sessionUser = session?.user as SessionUser;

    if (!session) {
      redirect("/signin");
    }

    if (sessionUser.role !== "user") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { amount, description, email, feeId, month, year } = await req.json();

    if (!amount || !description || !email || !feeId || !month || !year) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const redirectURL = new URL(req.url).origin;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Fee of ${month}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      submit_type: "pay",
      mode: "payment",
      success_url: `${redirectURL}/user/fees/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectURL}/user/fees?canceled=true`,
      customer_email: email,
      client_reference_id: feeId,
      metadata: {
        month,
        year,
        description,
        email,
        feeId,
      },
    });

    return NextResponse.json(
      {
        stripeSession,
      },
      { status: 200 }
    );
  } catch (err: Error | any) {
  }
}
