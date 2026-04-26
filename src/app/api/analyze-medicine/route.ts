import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

const MOCK = {
  name: "بنادول إكسترا ٥٠٠ ملغ",
  expiryDate: "2025-08-15",
  status: "expired" as const,
  confidence: 0.95,
};

function todayPlusMonths(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageBase64, mediaType } = body as {
      imageBase64?: string;
      mediaType?: string;
    };

    if (!anthropic || !imageBase64) {
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ ...MOCK, mock: true });
    }

    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system:
        "أنت محلل صور أدوية. حلل صورة العلبة وأعد JSON فقط بهذا الشكل بدون أي نص إضافي:\n" +
        '{"name": "اسم الدواء بالعربي", "expiryDate": "YYYY-MM-DD", "status": "expired|nearExpiry|unused", "confidence": 0.0-1.0}\n' +
        "إذا تاريخ الانتهاء قبل اليوم استخدم expired. إذا خلال ٣ أشهر القادمة استخدم nearExpiry. خلاف ذلك unused.\n" +
        "إذا لم تتعرف على الدواء أعد JSON بقيم تقديرية وconfidence منخفض. JSON فقط.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: (mediaType || "image/jpeg") as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: "حلل علبة الدواء في الصورة وأعد JSON فقط." },
          ],
        },
      ],
    });

    const text = resp.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("")
      .trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ ...MOCK, mock: true, fallback: true });
    }
    const parsed = JSON.parse(match[0]);
    return NextResponse.json({
      name: parsed.name || MOCK.name,
      expiryDate: parsed.expiryDate || todayPlusMonths(-2),
      status: ["expired", "nearExpiry", "unused"].includes(parsed.status)
        ? parsed.status
        : "expired",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    });
  } catch (e) {
    console.error("analyze-medicine error", e);
    return NextResponse.json({ ...MOCK, mock: true, error: true });
  }
}
