import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boucherie Goetz & Co — Hochfelden',
  description: 'Boucherie, Charcuterie, Traiteur artisanal à Hochfelden. Goetz & Co vous propose une sélection de viandes issues de producteurs locaux alsaciens.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
