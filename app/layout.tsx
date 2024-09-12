import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { HolidaysProvider } from "./_providers/holidays-context";
import { AppSettingsProvider } from "./_providers/app-settings-context";
import { EventMapProvider } from "./_providers/event-map-context";
import { AppStateProvider } from "./_providers/app-state-context";
import { PrintProvider } from "./_providers/print-context";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <HolidaysProvider>
              <AppSettingsProvider>
                <EventMapProvider>
                  <AppStateProvider>
                    <PrintProvider>
                      <SiteHeader />
                      {children}
                    </PrintProvider>
                    <Toaster />
                  </AppStateProvider>
                </EventMapProvider>
              </AppSettingsProvider>
            </HolidaysProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
