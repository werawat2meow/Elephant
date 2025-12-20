import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body.totalPrice !== "number") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const siteOrigin = process.env.SITE_ORIGIN || "http://localhost:3000";
    const bookingRef = body.paymentReference || `bk_${Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: { name: body.packageName || "Booking" },
            unit_amount: Math.round(body.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingRef,
        packageName: String(body.packageName || ""),
        date: String(body.date || ""),
        time: String(body.time || ""),
        adults: String(body.adults ?? "0"),
        children: String(body.children ?? "0"),
        infants: String(body.infants ?? "0"),
        totalPrice: String(body.totalPrice ?? "0"),
        name: String(body.name || ""),
        email: String(body.email || ""),
        phone: String(body.phone || ""),
        hotel: String(body.hotel || ""),
        roomNumber: String(body.roomNumber || ""),
        whatsapp: String(body.whatsapp || ""),
        transferOption: String(body.transferOption || ""),
        specialRequests: String(body.specialRequests || ""),
      },
      success_url: `${siteOrigin}/booking?status=success&bookingRef=${bookingRef}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteOrigin}/booking?status=cancel&bookingRef=${bookingRef}`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("create-checkout error:", err?.message || err);
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }
}
