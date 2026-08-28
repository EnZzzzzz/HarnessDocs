import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Harness · Agent Harness 研究文档可视化',
  description:
    'Agent Harness 与模型训练方向的论文阅读笔记与可视化：Harness 设计、轨迹数据、数据合成与 RL 后训练。',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#eef2fd',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className="font-sans antialiased">
        <div className="dream-bg" aria-hidden="true">
          <div className="dream-bg-blobs" />
          <div className="dream-bg-grid" />
        </div>
        <div className="relative z-10 flex min-h-svh flex-col">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-500/25">
                H
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-800">
                Harness Docs
              </span>
            </Link>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
          <footer className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-slate-400">
            Harness Docs · Agent Harness 研究阅读笔记
          </footer>
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
