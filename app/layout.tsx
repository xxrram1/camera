import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Film Camera App',
  description: 'Premium film camera experience with vintage filters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

