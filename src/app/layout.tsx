import type { Metadata } from "next";
import '@/app/(default)/global.scss';

export const metadata: Metadata = {
  title: "Awesome Sauce Events",
  description: "Register for Awesome Sauce Events.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Awesome Sauce Events",
    description: "Register for Awesome Sauce Events.",
    siteName: "Awesome Sauce Events",
    images: [
      {
        url: "/img/og-logo.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  icons: {
    icon: "/img/icons/favicon.png",
    apple: "/img/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css?family=Agdasima:400,700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:600"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
