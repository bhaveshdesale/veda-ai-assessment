import { AppShell } from "@/components/layout/app-shell";
import { AssignmentsPage } from "@/components/assignments/assessments-page";

export default function AssignmentsRoute() {
  return (
    <AppShell>
      <AssignmentsPage />
    </AppShell>
  );
}