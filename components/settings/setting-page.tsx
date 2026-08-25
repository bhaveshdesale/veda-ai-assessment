import { ChevronRight, Settings2 } from "lucide-react";

const sections = [
  {
    title: "Profile",
    description: "Manage your teacher profile information.",
  },
  {
    title: "Notifications",
    description: "Choose how you receive notifications.",
  },
  {
    title: "AI Preferences",
    description: "Configure assessment AI preferences.",
  },
  {
    title: "School",
    description: "Manage your school information.",
  },
];

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-[900px] p-6 sm:p-8 lg:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f15b32]">
        Preferences
      </p>

      <h1 className="mt-2 text-[28px] font-bold tracking-[-0.05em] text-[#34342f]">
        Settings
      </h1>

      <p className="mt-2 text-[11px] text-[#85837a]">
        Manage your account and application preferences.
      </p>

      <div className="mt-8 space-y-3">
        {sections.map((section) => (
          <button
            key={section.title}
            type="button"
            className="flex w-full items-center justify-between rounded-[15px] bg-[#fffdf8] p-5 text-left shadow-[0_2px_12px_rgba(70,60,40,0.05)] hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#f1eee6] text-[#77746c]">
                <Settings2 size={15} />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#34342f]">
                  {section.title}
                </p>

                <p className="mt-1 text-[9px] text-[#99968c]">
                  {section.description}
                </p>
              </div>
            </div>

            <ChevronRight
              size={15}
              className="text-[#aaa69d]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}