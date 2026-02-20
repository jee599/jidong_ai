import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "집값AI | 집값 판단 보조 플랫폼",
    template: "%s | 집값AI"
  },
  description: "취득세 계산, 매물 검색, 무료 대시보드, 유료 AI 요약 리포트를 제공하는 집값AI",
  keywords: ["취득세 계산기", "부동산 대시보드", "집값AI", "실거래가", "부동산 AI"],
  openGraph: {
    title: "집값AI",
    description: "정책 기준일/버전 메타와 함께 제공되는 한국형 부동산 판단 보조 서비스",
    locale: "ko_KR",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
