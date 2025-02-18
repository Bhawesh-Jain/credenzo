import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { DialogProvider } from "@/providers/DialogProvider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Credenzo',
  description: 'Complete Loan Solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DialogProvider>
          {children}
          <Toaster />
        </DialogProvider>
      </body>
    </html>
  )
}
