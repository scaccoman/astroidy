import '#/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Astroidy',
    template: '%s | Astroidy',
  },
  metadataBase: new URL('https://astroidy.vercel.app'),
  description: 'Get the latest asteroid information from NASA.',
  openGraph: {
    title: 'Astroidy',
    description: 'Get the latest asteroid information from NASA.',
    images: [`/api/og?title=Astroidy`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full [color-scheme:dark]">
      <body className="h-full overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')]">
        <div className="flex h-full items-center justify-center p-4">
          <div className="h-full w-5/6 rounded-lg p-px shadow-lg shadow-black/20">
            <div className="w-full rounded-lg bg-black p-3.5 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
