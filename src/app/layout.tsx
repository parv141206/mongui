"use client";
import { ModalProvider } from "@/hooks/useModal";
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
        <ModalProvider>
          <body className={``}>{children}</body>
        </ModalProvider>
      </ConfirmProvider>
    </html>
  );
}
