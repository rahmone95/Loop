import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

type Status = "expired" | "nearExpiry" | "valid";

const MOCK = {
  name: "بنادول إكسترا ٥٠٠ ملغ",
  expiryDate: "2025-08-15",
  confidence: 0.95,
};

function computeStatus(expiryDate: string): Status {
  const exp = new Date(expiryDate).getTime();
  if (Number.isNaN(exp)) return "valid";
  const days = Math.floor((exp - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "expired";
  if (days <= 30) return "nearExpiry";
  return "valid";
}

type ImagePart = {
  type: "image";
  source: {
    type: "base64";
    media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    data: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      boxImage,
      expiryImage,
      boxMediaType = "image/jpeg",
      expiryMediaType = "image/jpeg",
      // legacy single-image fallback
      imageBase64,
      mediaType,
    } = body as {
      boxImage?: string;
      expiryImage?: string;
      boxMediaType?: string;
      expiryMediaType?: string;
      imageBase64?: string;
      mediaType?: string;
    };

    const haveAny = boxImage || expiryImage || imageBase64;

    if (!anthropic || !haveAny) {
      await new Promise((r) => setTimeout(r, 800));
      const expiryDate = MOCK.expiryDate;
      return NextResponse.json({
        ...MOCK,
        expiryDate,
        status: computeStatus(expiryDate),
        mock: true,
      });
    }

    const imageParts: ImagePart[] = [];
    if (boxImage) {
      imageParts.push({
        type: "image",
        source: {
          type: "base64",
          media_type: boxMediaType as ImagePart["source"]["media_type"],
          data: boxImage,
        },
      });
    }
    if (expiryImage) {
      imageParts.push({
        type: "image",
        source: {
          type: "base64",
          media_type: expiryMediaType as ImagePart["source"]["media_type"],
          data: expiryImage,
        },
      });
    }
    if (imageParts.length === 0 && imageBase64) {
      imageParts.push({
        type: "image",
        source: {
          type: "base64",
          media_type: (mediaType || "image/jpeg") as ImagePart["source"]["media_type"],
          data: imageBase64,
        },
      });
    }

    const intro =
      imageParts.length === 2
        ? "تستلم صورتين: الأولى للعلبة، الثانية لتاريخ الانتهاء."
        : "تستلم صورة لعلبة الدواء.";

    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system:
        `أنت محلل صور أدوية. ${intro}\n` +
        "استخرج المعلومات وأعد JSON فقط بهذا الشكل بدون أي نص إضافي:\n" +
        '{"name": "اسم الدواء بالعربي مع التركيز", "expiryDate": "YYYY-MM-DD", "confidence": 0.0-1.0}\n' +
        "إذا كانت الصور غير واضحة، اجعل confidence أقل من 0.5. JSON فقط.",
      messages: [
        {
          role: "user",
          content: [
            ...imageParts,
            { type: "text", text: "حلّل الصور وأعد JSON فقط." },
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
      const expiryDate = MOCK.expiryDate;
      return NextResponse.json({
        ...MOCK,
        expiryDate,
        status: computeStatus(expiryDate),
        mock: true,
        fallback: true,
      });
    }
    const parsed = JSON.parse(match[0]);
    const expiryDate: string = parsed.expiryDate || MOCK.expiryDate;
    return NextResponse.json({
      name: parsed.name || MOCK.name,
      expiryDate,
      status: computeStatus(expiryDate),
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    });
  } catch (e) {
    console.error("analyze-medicine error", e);
    const expiryDate = MOCK.expiryDate;
    return NextResponse.json({
      ...MOCK,
      expiryDate,
      status: computeStatus(expiryDate),
      mock: true,
      error: true,
    });
  }
}
