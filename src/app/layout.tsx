import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATELIER CUIR | 手工皮具工坊",
  description: "传承手工皮具工艺，每一针每一线都是时间的沉淀。精品钱包、卡包、手袋定制。",
  keywords: ["手工皮具", "钱包", "卡包", "手袋", "定制", "植鞣革", "工艺"],
  openGraph: {
    title: "ATELIER CUIR | 手工皮具工坊",
    description: "传承手工皮具工艺，每一针每一线都是时间的沉淀。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
