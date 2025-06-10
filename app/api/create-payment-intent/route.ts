// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest) {
//   try {
//     const { amount } = await req.json();

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "thb",
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.log("Internal server error", (error as Error).message);
//     return NextResponse.json(
//       { error: `Internal server error ${error}` },
//       { status: 500 }
//     );
//   }
// }
