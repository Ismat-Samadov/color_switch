import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Color Switch — Reflex Game',
  description:
    'Pass the ball through spinning shapes only through matching color segments — deceptively hard.',
  keywords: ['color switch', 'reflex game', 'browser game', 'next.js'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#08080F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
