import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
// import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skypro.Music",
  description: "Музыкальный сервис ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
