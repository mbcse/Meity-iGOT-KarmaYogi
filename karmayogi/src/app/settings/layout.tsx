"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link href="/settings" className={`${pathname === '/settings' ? 'font-semibold text-primary' : ''}`}>
              Add
            </Link>
            <Link href="/settings/database" className={`${pathname === '/settings/database' ? 'font-semibold text-primary' : ''}`}>
              DB Setup
            </Link>
            <Link href="/settings/backend" className={`${pathname === '/settings/backend' ? 'font-semibold text-primary' : ''}`}>
              Backend Setup
            </Link>
            <Link href="/settings/llms" className={`${pathname === '/settings/llms' ? 'font-semibold text-primary' : ''}`}>
              LLM Setup
            </Link>
          </nav>
          <div className="grid gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
