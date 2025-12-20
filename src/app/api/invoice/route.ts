import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

type InvoiceRequestBody = {
  invoiceNo?: string;
  issuedAt?: string;
  packageName: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  infants?: number;
  totalPrice: number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    hotel?: string;
    roomNumber?: string;
    whatsapp?: string;
    transferOption?: string;
  };
};

const formatNumber = (n: number) => n.toLocaleString("en-US");

export async function POST(req: Request) {
  let body: InvoiceRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const missing: string[] = [];
  if (!body?.packageName) missing.push("packageName");
  if (!body?.date) missing.push("date");
  if (!body?.time) missing.push("time");
  if (typeof body?.adults !== "number") missing.push("adults");
  if (typeof body?.children !== "number") missing.push("children");
  if (typeof body?.totalPrice !== "number") missing.push("totalPrice");

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing/invalid fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const issuedAt = body.issuedAt ? new Date(body.issuedAt) : new Date();
    const invoiceNo =
      body.invoiceNo ??
      `INV-${issuedAt.getFullYear()}${String(issuedAt.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(issuedAt.getDate()).padStart(2, "0")}-${String(
        issuedAt.getHours()
      ).padStart(2, "0")}${String(issuedAt.getMinutes()).padStart(
        2,
        "0"
      )}${String(issuedAt.getSeconds()).padStart(2, "0")}`;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    let font: any;
    let fontBold: any;
    let unicodeFont = false;
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansThai-Regular.ttf"
      );
      const fontBytes = await fs.readFile(fontPath);
      font = await pdf.embedFont(fontBytes);
      // If there's no bold variant, use the same font for bold text.
      fontBold = font;
      unicodeFont = true;
    } catch (e) {
      // Fallback to standard fonts (WinAnsi) if no TTF is provided.
      font = await pdf.embedFont(StandardFonts.Helvetica);
      fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    }

    // Watermark logo
    try {
      const logoPath = path.join(
        process.cwd(),
        "public",
        "images",
        "elephants",
        "logo",
        "logo.jpg"
      );
      const logoBytes = await fs.readFile(logoPath);
      const logoImage = await pdf.embedJpg(logoBytes);

      const maxW = width * 0.65;
      const maxH = height * 0.65;
      const scale = Math.min(maxW / logoImage.width, maxH / logoImage.height);

      const drawW = logoImage.width * scale;
      const drawH = logoImage.height * scale;

      page.drawImage(logoImage, {
        x: (width - drawW) / 2,
        y: (height - drawH) / 2,
        width: drawW,
        height: drawH,
        opacity: 0.08,
      });
    } catch {
      // If logo is missing, still generate invoice.
    }

    const marginX = 48;
    let cursorY = height - 60;

    const drawText = (
      text: string,
      opts?: {
        size?: number;
        bold?: boolean;
        color?: { r: number; g: number; b: number };
        x?: number;
        y?: number;
      }
    ) => {
      const size = opts?.size ?? 12;
      const x = opts?.x ?? marginX;
      const y = opts?.y ?? cursorY;
      const useFont = opts?.bold ? fontBold : font;
      const color = opts?.color ?? { r: 0.1, g: 0.1, b: 0.1 };

      page.drawText(text, {
        x,
        y,
        size,
        font: useFont,
        color: rgb(color.r, color.g, color.b),
      });

      return y;
    };

    // Header
    drawText("Invoice", { size: 22, bold: true });
    cursorY -= 28;
    drawText(`Invoice No: ${invoiceNo}`, {
      size: 11,
      color: { r: 0.25, g: 0.25, b: 0.25 },
    });
    cursorY -= 16;
    drawText(`Issued At: ${issuedAt.toLocaleString()}`, {
      size: 11,
      color: { r: 0.25, g: 0.25, b: 0.25 },
    });

    cursorY -= 24;
    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    cursorY -= 22;

    // Booking details
    drawText("Booking Details", { bold: true, size: 14 });
    cursorY -= 18;
    drawText(`Package: ${body.packageName}`);
    cursorY -= 14;
    drawText(`Date: ${body.date}`);
    cursorY -= 14;
    drawText(`Time: ${body.time}`);
    cursorY -= 14;
    const participantParts: string[] = [
      `Adults ${body.adults}`,
      `Children ${body.children}`,
    ];
    if (typeof body.infants === "number") {
      participantParts.push(`Infants ${body.infants}`);
    }

    drawText(`Participants: ${participantParts.join(", ")}`);

    cursorY -= 22;
    drawText("Customer", { bold: true, size: 14 });
    cursorY -= 18;

    const customerLines: string[] = [];
    if (body.customer?.name) customerLines.push(`Name: ${body.customer.name}`);
    if (body.customer?.email)
      customerLines.push(`Email: ${body.customer.email}`);
    if (body.customer?.phone)
      customerLines.push(`Phone: ${body.customer.phone}`);
    if (body.customer?.whatsapp)
      customerLines.push(`WhatsApp: ${body.customer.whatsapp}`);
    if (body.customer?.transferOption) {
      const transferLabel =
        body.customer.transferOption === "free"
          ? "Free transfer"
          : body.customer.transferOption === "no_transfer"
          ? "No transfer"
          : body.customer.transferOption;
      customerLines.push(`Transfer: ${transferLabel}`);
    }
    if (body.customer?.hotel)
      customerLines.push(`Hotel: ${body.customer.hotel}`);
    if (body.customer?.roomNumber)
      customerLines.push(`Room: ${body.customer.roomNumber}`);

    if (!customerLines.length) customerLines.push("(not provided)");

    for (const line of customerLines) {
      drawText(line);
      cursorY -= 14;
    }

    cursorY -= 18;
    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    cursorY -= 22;

    // Total
    drawText("Total", { bold: true, size: 14 });
    cursorY -= 18;
    const totalText = unicodeFont
      ? `Total Price: ฿${formatNumber(body.totalPrice)}`
      : `Total Price: THB ${formatNumber(body.totalPrice)}`;

    drawText(totalText, {
      bold: true,
      size: 18,
    });

    const bytes = await pdf.save();

    // Normalize to a Uint8Array backed by ArrayBuffer (not ArrayBufferLike)
    const safeBytes = Uint8Array.from(bytes);

    return new Response(safeBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceNo}.pdf`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Invoice generation failed", err);
    return NextResponse.json(
      { error: "Invoice generation failed" },
      { status: 500 }
    );
  }
}
