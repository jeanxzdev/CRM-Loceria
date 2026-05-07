"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { Loader2 } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const isLoginPage = pathname === "/login" || pathname === "/login/";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !isLoginPage) {
      router.push("/login");
    } else if (token && isLoginPage) {
      router.push("/");
    } else {
      setIsAuthChecking(false);
    }
  }, [pathname, router, isLoginPage]);

  if (isAuthChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (isLoginPage) {
    return <QueryProvider>{children}</QueryProvider>;
  }

  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
