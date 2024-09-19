import { Metadata, Viewport } from 'next'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { siteConfig } from '@/config/site'
import { satoshi } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import './globals.css'

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    icon: './favicon.ico',
    shortcut: './favicon-32x32.png',
    apple: './apple-touch-icon.png',
  },
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'relative h-full min-h-screen bg-background font-satoshi leading-6 tracking-[.2px] antialiased',
            satoshi.variable,
          )}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            storageKey='digital-aqi-theme'>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
