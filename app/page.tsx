import { AppShell } from "@/components/layout/app-shell";
import { HomePage } from "@/components/home/home-page";

export default function HomeRoute() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}