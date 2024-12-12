import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { auth } from "../../auth";
import Navbar from "@/components/navbar/navbar";
import ThemeToggle from "@/components/theming/theme-toggle";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import UtilitySidebar from "@/components/utility-sidebar";
import Providers from "@/components/context/providers";
import DesktopSidebar from "@/components/navbar/desktop-sidebar";
import MobileBottomBar from "@/components/navbar/mobile-bottombar";
import MobileSidebar from "@/components/navbar/mobile-sidebar";
import MobileTopBar from "@/components/navbar/mobile-topbar";
import TabletSidebar from "@/components/navbar/tablet-sidebar";

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

/* function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <UtilitySidebar className="hidden lg:flex" />
    </>
  );
} */
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDrawerState = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <MaxWidthWrapper
        className={cn(
          "h-full lg:p-0 relative md:grid md:grid-cols-[88px_1fr] lg:grid lg:grid-cols-[275px_1fr_350px]"
        )}
      >
        <Navbar />
        <main>{children}</main>
        <UtilitySidebar className="hidden lg:flex" />
        {/* mobile navigation */}
        {/* mobile topbar */}
        <MobileTopBar handleDrawerState={handleDrawerState} />
        {/* mobile bottombar */}
        <MobileBottomBar pathname={pathname} />
        {/*  Mobile sidebar */}
        <MobileSidebar
          isSidebarOpen={isSidebarOpen}
          handleDrawerState={handleDrawerState}
          pathname={pathname}
        />
        {/* ==================================================== */}
        {/* tablet navigation */}
        <TabletSidebar />
        {/* desktop navigation */}
        <DesktopSidebar />
        {/* desktop rightbar */}
        <UtilitySidebar className="hidden lg:flex" />
      </MaxWidthWrapper>
    </>
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
          <MaxWidthWrapper
            className={cn("h-full lg:p-0 relative ", {
              "grid place-content-center": !isAuthenticated,
              "md:grid md:grid-cols-[88px_1fr] lg:grid lg:grid-cols-[275px_1fr_350px]":
                isAuthenticated,
            })}
          >
            {isAuthenticated ? (
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            ) : (
              <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
            )}
            <Toaster />
          </MaxWidthWrapper>
        </Providers>
      </body>
    </html>
  );
}
