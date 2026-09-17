import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Global Cybersecurity Community Forums",
    template: "%s | Global Cybersecurity Community Forums",
  },
  description:
    "Global Cybersecurity Community Forums (GCCF) - Fostering global cybersecurity collaboration, research, and defense.",
  icons: {
    icon: [
      { url: "/FAVICON.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/FAVICON.png"],
    apple: [{ url: "/FAVICON.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/FAVICON.png" type="image/png" />
        <link rel="shortcut icon" href="/FAVICON.png" />
        <link rel="apple-touch-icon" href="/FAVICON.png" />
      </head>
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
