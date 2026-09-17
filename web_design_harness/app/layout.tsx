import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Design Harness — 设计研讨", template: "%s | Design Harness" },
  description: "RSI Harness 方案研讨：留下 Skill 版本，固定评测用例，由人查看结果并推动下一次改进。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><AppShell>{children}</AppShell></body></html>;
}
