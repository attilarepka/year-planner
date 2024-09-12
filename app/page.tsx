"use client";
import { Calendar } from "@/components/calendar";
import { useAppState } from "./_providers/app-state-context";
import { YearForm } from "@/components/form";

export default function Home() {
  const { planMode } = useAppState();

  return (
    <div className="flex flex-col min-h-[80vh] font-[var(--font-geist-sans)]">
      <main className="flex flex-grow items-center justify-center w-full min-h-[80vh]">
        {planMode ? <Calendar /> : <YearForm />}
      </main>
    </div>
  );
}
