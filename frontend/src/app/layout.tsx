import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoceriaTrujillo CRM",
  description: "Sistema de Gestión de Clientes para Locería Trujillo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full bg-slate-50">
      <body className={`${inter.className} h-full antialiased text-slate-900`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
