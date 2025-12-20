import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

const PROCESSED_FILE = path.join(process.cwd(), "payments-processed.json");

async function readProcessed(): Promise<Record<string, boolean>> {
  try {
    const raw = await fs.readFile(PROCESSED_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function writeProcessed(obj: Record<string, boolean>) {
  await fs.writeFile(PROCESSED_FILE, JSON.stringify(obj, null, 2), "utf8");
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "webhook_secret_missing" },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature") || "";
  const buf = await req.arrayBuffer();
  const raw = Buffer.from(buf);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    console.error(
      "Webhook signature verification failed:",
      err?.message || err
    );
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const processed = await readProcessed();

  try {
    // Handle checkout.session.completed (recommended for Checkout)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId = session.payment_intent as string | undefined;
      const sessionId = session.id;

      if (processed[sessionId]) {
        return NextResponse.json({ received: true, note: "already_processed" });
      }

      // extract metadata (booking info should be set as metadata when creating session)
      const metadata = session.metadata || {};

      const payload: any = {
        paymentId: paymentIntentId || sessionId,
        paymentReference: sessionId,
        packageName: metadata.packageName || metadata.package || "",
        date: metadata.date || "",
        time: metadata.time || "",
        adults: Number(metadata.adults || 0),
        children: Number(metadata.children || 0),
        infants: Number(metadata.infants || 0),
        totalPrice:
          Number(metadata.totalPrice || session.amount_total || 0) / 100,
        name: metadata.name || "",
        email: metadata.email || "",
        phone: metadata.phone || "",
        hotel: metadata.hotel || "",
        roomNumber: metadata.roomNumber || "",
        whatsapp: metadata.whatsapp || "",
        transferOption: metadata.transferOption || "",
        specialRequests: metadata.specialRequests || "",
      };

      // Call internal booking-notify
      const siteOrigin = process.env.SITE_ORIGIN || "http://localhost:3000";
      await fetch(`${siteOrigin}/api/booking-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      processed[sessionId] = true;
      await writeProcessed(processed);
    }

    // Also handle payment_intent.succeeded as fallback
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (processed[pi.id]) {
        return NextResponse.json({ received: true, note: "already_processed" });
      }

      const metadata = pi.metadata || {};
      const payload: any = {
        paymentId: pi.id,
        paymentReference: pi.id,
        packageName: metadata.packageName || "",
        date: metadata.date || "",
        time: metadata.time || "",
        adults: Number(metadata.adults || 0),
        children: Number(metadata.children || 0),
        infants: Number(metadata.infants || 0),
        totalPrice: Number(pi.amount_received || 0) / 100,
        name: metadata.name || "",
        email: metadata.email || "",
        phone: metadata.phone || "",
        hotel: metadata.hotel || "",
        roomNumber: metadata.roomNumber || "",
        whatsapp: metadata.whatsapp || "",
        transferOption: metadata.transferOption || "",
        specialRequests: metadata.specialRequests || "",
      };

      const siteOrigin = process.env.SITE_ORIGIN || "http://localhost:3000";
      await fetch(`${siteOrigin}/api/booking-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      processed[pi.id] = true;
      await writeProcessed(processed);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }
}
