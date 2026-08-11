import type { Metadata } from "next";
import { Agdasima } from "next/font/google";
import '@/app/(default)/global.scss';

const agdasima = Agdasima({
  subsets: ["latin"],
  variable: "--font-agdasima",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bitbash.azurewebsites.net"),
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
      <body className={agdasima.variable}>
        {children}
      </body>
    </html>
  );
}
