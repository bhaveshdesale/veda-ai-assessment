import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <p className="text-sm text-[#85837a]">
          Application Shell
        </p>
      </div>
    </AppShell>
  );
}