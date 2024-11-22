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
      <head>
        <title>MongUI</title>
        <meta
          name="description"
          content="MongUI is a web application that allows users to visually draw Mongoose models and extract them as code with a click of a button."
        />
        <meta
          name="keywords"
          content="MongUI, Mongoose, MongoDB, schema design, web application, code generation, visual modeling"
        />
        <meta name="author" content="Parv Shah and Rudra Mehta" />
        <meta
          property="og:title"
          content="MongUI - Mongoose Model Drawing Tool"
        />
        <meta
          property="og:description"
          content="Create and extract Mongoose models effortlessly with MongUI."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mongui.vercel.app/" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <ConfirmProvider>
        <ModalProvider>
          <body className={``}>{children}</body>
        </ModalProvider>
      </ConfirmProvider>
    </html>
  );
}
