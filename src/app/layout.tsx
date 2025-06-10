import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio OS',
  description: 'A portfolio website designed as an operating system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize accent colors from localStorage or defaults
              const primaryAccent = localStorage.getItem('primary-accent') || '#1e3a8a';
              const secondaryAccent = localStorage.getItem('secondary-accent') || '#7c3aed';
              
              document.documentElement.style.setProperty('--primary-accent', primaryAccent);
              document.documentElement.style.setProperty('--secondary-accent', secondaryAccent);
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
