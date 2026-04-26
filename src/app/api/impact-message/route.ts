import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

const FALLBACKS = [
  "خطوة واحدة منك حمت لترات من المياه الجوفية وحوّلت أدوية منسية لأثر بيئي حقيقي.",
  "استمراريتك في تسليم أدويتك تجعل الرياض أنظف، والأسر السعودية أكثر وعيًا بصحتها.",
  "أنت ضمن من يصنعون التغيير — كل علبة تسلّمها تقربنا خطوة من اقتصاد دائري وصحي.",
];

export async function POST(req: NextRequest) {
  try {
    const stats = await req.json().catch(() => ({}));
    if (!anthropic) {
      return NextResponse.json({
        message: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
        mock: true,
      });
    }
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 200,
      system:
        "اكتب رسالة قصيرة (جملتين فقط) بالعربية الفصحى، تحفّز المستخدم على إنجازاته البيئية في تطبيق Loop. تجنب الكلمات المعقدة. لا تستخدم الإيموجي.",
      messages: [
        {
          role: "user",
          content: `إحصائياتي: ${stats.medicinesRecovered ?? 8} علبة، ${
            stats.co2Saved ?? 0.8
          } كجم انبعاثات متجنبة، ترتيبي #${stats.rank ?? 142}.`,
        },
      ],
    });
    const text = resp.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("")
      .trim();
    return NextResponse.json({ message: text || FALLBACKS[0] });
  } catch (e) {
    console.error("impact-message error", e);
    return NextResponse.json({
      message: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
      mock: true,
    });
  }
}
