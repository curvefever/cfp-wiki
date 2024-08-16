import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Popups from './Popups'

const asap = localFont({
    src: [
        {
            path: '../../public/fonts/asap-regular-webfont.ttf',
            weight: '500'
        },
        {
            path: '../../public/fonts/asap-semibold-webfont.ttf',
            weight: '600'
        },
        {
            path: '../../public/fonts/asap-bold-webfont.ttf',
            weight: '700'
        }
    ],
    variable: '--font-asap'
})

export const metadata: Metadata = {
    title: 'CF Wiki',
    description: 'The official Curve Fever Pro wiki. The ultimate game guide where you can find all the information you need to know about Curve Fever.',
    applicationName: 'CF Wiki',
    referrer: 'origin-when-cross-origin',
    keywords: ['curvefever', 'curve fever pro', 'curve fever wiki', 'curve wiki', 'cf wiki', 'cfp wiki', 'wiki', 'wikipedia', 'guide', 'knowledgebase'],
    creator: 'Curve Fever Pro',
    publisher: 'Curve Fever Pro',
    openGraph: {
        title: 'CF Wiki',
        description: 'The official Curve Fever Pro wiki. The ultimate game guide where you can find all the information you need to know about Curve Fever.',
        url: 'https://wiki.curvefever.pro',
        siteName: 'CF Wiki',
        images: [
          {
            url: 'https://wiki.curvefever.pro/icon.png',
            width: 512,
            height: 512,
          }
        ],
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
    },
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/apple-icon.png',
        other: {
          rel: 'apple-touch-icon-precomposed',
          url: '/icon.png',
        },
    }
  }


export default function RootLayout({ children }: {children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className={`${asap.variable} font-asap flex flex-col min-h-[100vh] overflow-x-hidden bg-bg text-text`}>
                <Popups>
                    {children}
                </Popups>
            </body>
        </html>
    )
}
