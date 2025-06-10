import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "text-sm md:text-base",
          style: {
            color: "#fafafa",
            backgroundColor: "#3f3f46",
            borderColor: "#52525b",
          },
          duration: 2000,
        }}
      />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
