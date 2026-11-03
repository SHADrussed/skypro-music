import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const stratos = localFont({
  src: "./fonts/stratosskyengweb-regular.woff2",
  variable: "--font-stratos",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skypro.Music",
  description: "Музыкальный сервис ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={stratos.variable}>
      <body>{children}</body>
    </html>
  );
}
