"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "" : "min-h-screen"}>
        {children}
      </main>
    </>
  );
}
