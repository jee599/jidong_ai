import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "집값AI - Policy Engine Baseline",
  description: "Phase 1 Day 1 baseline for acquisition tax and DSR policy APIs."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
