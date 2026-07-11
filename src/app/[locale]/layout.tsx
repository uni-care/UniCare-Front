import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display, Geist, Amiri } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { QueryProvider } from "@/lib/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: 'swap',
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uni-care-front.vercel.app"),
  title: "UniCare | Artistic University Students Ecosystem",
  description: "The roots of uni students grow through the soil of art. A community-driven ecosystem for university students to share, lend, and grow together.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Load translations
  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(
        "h-full antialiased scroll-smooth",
        spaceGrotesk.variable,
        playfairDisplay.variable,
        amiri.variable,
        "font-sans",
        geist.variable
      )}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
      </head>
      <body 
        className={cn(
          "min-h-full flex flex-col bg-background-light text-[#131615] selection:bg-primary/30 relative",
          locale === "ar" ? amiri.className : spaceGrotesk.className
        )} 
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                className:
                  "rounded-2xl border border-primary/10 bg-white text-[#131615] shadow-lg shadow-primary/10",
              }}
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
