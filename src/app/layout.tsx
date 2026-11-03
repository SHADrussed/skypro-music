import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";

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
      <body><Suspense fallback={null}><StoreProvider>{children}</StoreProvider></Suspense></body>
    </html>
  );
}
