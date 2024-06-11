import { UserNavbar } from "@/app/components/user_navbar";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Toping Now Dashboard",
  description: "This is topingnow",
};

export const dynamic = "force-dynamic";

export default function UserLayout({ children }) {
  return (
    <>
      <header className="z-40">
        <UserNavbar />
      </header>
      <main>
        <div className="flex flex-col">
          <div className="mt-12 ml-2 sm:ml-11 mr-2 lg:ml-96 md:ml-60">
            {children}
          </div>
        </div>
        <Toaster position="bottom-right" visibleToasts={6} richColors />
      </main>
    </>
  );
}
