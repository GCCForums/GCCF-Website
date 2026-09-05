import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "GCCF",
  description: "GCCF Official Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
