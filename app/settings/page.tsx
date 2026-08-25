import { AppShell } from "@/components/layout/app-shell";
import { SettingsPage } from "@/components/settings/setting-page";

export default function SettingsRoute() {
  return (
    <AppShell>
      <SettingsPage />
    </AppShell>
  );
}