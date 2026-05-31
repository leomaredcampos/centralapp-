import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import RegisterSW from "./register-sw";
import PreventZoom from "./prevent-zoom";

export const metadata: Metadata = {
  title: "CentralApp",
  description: "CentralApp",
  manifest: "/manifest.json",
  icons: {
    icon: "/api/company-logo?type=main&id=1",
    apple: "/api/company-logo?type=main&id=1",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ fontFamily: "Calibri, sans-serif", fontSize: "clamp(10.5px, min(0.78vw, 1.2vh), 14px)" }}>
        <RegisterSW />
        <PreventZoom />
        {children}
      </body>
    </html>
  );
}
