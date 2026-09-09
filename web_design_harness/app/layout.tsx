import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Design Harness — 设计研讨", template: "%s | Design Harness" },
  description: "从一个设计问题出发，研究约束、反馈与迭代如何成为可复用的设计经验。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><AppShell>{children}</AppShell></body></html>;
}
