import { AppShell } from "@/components/layout/app-shell";
import { LibraryPage } from "@/components/library/library-page";

export default function LibraryRoute() {
  return (
    <AppShell>
      <LibraryPage />
    </AppShell>
  );
}