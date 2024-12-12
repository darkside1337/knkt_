import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { auth } from "../../auth";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Providers from "@/components/context/providers";
import DesktopSidebar from "@/components/navbar/desktop-sidebar";
import MobileBottomBar from "@/components/navbar/mobile-bottombar";
import MobileTopbarAndSidebar from "@/components/navbar/mobile-topbar-and-sidebar";
import TabletSidebar from "@/components/navbar/tablet-sidebar";
import ThemeToggle from "@/components/theming/theme-toggle";
import UtilitySidebar from "@/components/utility-sidebar";

export const metadata: Metadata = {
  title: "KNKT_",
  description: "Social Media App",
  openGraph: {
    title: "KNKT_",
    description: "Social Media App",
    type: "website",
    locale: "en-US",
  },
};

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaxWidthWrapper
      className={cn(
        "h-full lg:p-0 relative md:grid md:grid-cols-[88px_1fr] lg:grid lg:grid-cols-[275px_1fr_350px]"
      )}
    >
      {/* mobile topbar and sidebar*/}
      <MobileTopbarAndSidebar className="grid md:hidden" />
      {/* tablet navigation */}
      <TabletSidebar className="hidden md:flex lg:hidden sticky top-0 left-0" />
      {/* desktop navigation */}
      <DesktopSidebar className="hidden sticky top-0 left-0 lg:flex" />
      <main>{children}</main>
      {/* Desktop rightbar */}
      <UtilitySidebar className="hidden lg:flex" />
      {/* mobile bottombar */}
      <MobileBottomBar className="block fixed md:hidden bottom-0 right-0" />
      {/*  Mobile sidebar */}

      <Toaster />
    </MaxWidthWrapper>
  );
}

function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MaxWidthWrapper
        className={cn("h-full lg:p-0 relative grid place-content-center")}
      >
        <ThemeToggle className="absolute top-4 right-1/2 translate-x-1/2" />
        {children}
      </MaxWidthWrapper>
    </>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  const session = await auth();
  const isAuthenticated = Boolean(session?.user);

  //
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen antialiased ${GeistMono.className}`}>
        <Providers session={session}>
          {isAuthenticated ? (
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          ) : (
            <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
          )}
        </Providers>
      </body>
    </html>
  );
}
