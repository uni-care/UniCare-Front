import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display, Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { QueryProvider } from "@/lib/query-provider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uni-care-front.vercel.app"),
  title: "UniCare | Artistic University Students Ecosystem",
  description: "The roots of uni students grow through the soil of art. A community-driven ecosystem for university students to share, lend, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "scroll-smooth", spaceGrotesk.variable, playfairDisplay.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background-light text-[#131615] selection:bg-primary/30 relative" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
