import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Loop | استرداد الأدوية، استدامة الأثر",
  description:
    "Loop — منصة استرداد الأدوية المنزلية في المملكة العربية السعودية. استرجع أدويتك المنتهية أو غير المستخدمة في أقرب صيدلية شريكة واكسب نقاطًا ومكافآت.",
  applicationName: "Loop",
};

export const viewport: Viewport = {
  themeColor: "#1E5BB8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
