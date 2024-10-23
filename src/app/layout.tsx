"use client";
import "./globals.css";
import { ConfirmProvider } from "@/hooks/useConfirm";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <ConfirmProvider>
        <body className={``}>{children}</body>
      </ConfirmProvider>
    </html>
  );
}
