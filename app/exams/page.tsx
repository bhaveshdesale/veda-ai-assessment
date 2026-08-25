import { AppShell } from "@/components/layout/app-shell";
import { ExamsPage } from "@/components/exams/exams-page";

export default function ExamsRoute() {
  return (
    <AppShell>
      <ExamsPage />
    </AppShell>
  );
}