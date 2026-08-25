// app/classroom/page.tsx

import { AppShell } from "@/components/layout/app-shell";
import { ClassroomPage } from "@/components/classroom/classroom-page";

export default function ClassroomRoute() {
  return (
    <AppShell>
      <ClassroomPage />
    </AppShell>
  );
}