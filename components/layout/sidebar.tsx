"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Grid2X2,
  Library,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

const navigationItems = [
  {
    label: "Home",
    href: "/",
    icon: Grid2X2,
  },
  {
    label: "My Classroom",
    href: "/classroom",
    icon: UsersRound,
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
  },
  {
    label: "Exams",
    href: "/exams",
    icon: FileText,
  },
  {
    label: "My Library",
    href: "/library",
    icon: Library,
  },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-[240px]",
          "flex-col bg-[#fffdf8] px-4 py-5",
          "shadow-[4px_0_24px_rgba(50,45,30,0.08)]",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:h-[calc(100vh-40px)] lg:w-[190px]",
          "lg:translate-x-0 lg:rounded-[16px]",
          "lg:shadow-[0_3px_16px_rgba(50,45,30,0.06)]",
        ].join(" ")}
      >
        {/* Mobile close button */}
        <div className="flex justify-end lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#66645d] hover:bg-[#f1eee6]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Brand */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 px-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#393a34]">
            <div className="h-3.5 w-3.5 rounded-[3px] bg-[#fffdf8]" />
          </div>

          <span className="text-[17px] font-bold tracking-[-0.05em] text-[#34342f]">
            VedaAI
          </span>
        </Link>

        {/* Toolkit button */}
        <button
          type="button"
          className="mt-7 flex h-[32px] items-center justify-center gap-1.5 rounded-full border-2 border-[#f36a42] bg-[#363731] px-3 text-[10px] font-medium text-white"
        >
          <Sparkles size={11} strokeWidth={1.8} fill="currentColor" />
          AI Teacher&apos;s Toolkit
        </button>

        {/* Main navigation */}
        <nav className="mt-7 flex-1">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "flex h-[35px] items-center gap-2.5 rounded-[8px] px-3",
                    "text-[11px] transition-colors",
                    isActive
                      ? "bg-[#eeece5] font-semibold text-[#34342f]"
                      : "font-medium text-[#85837a] hover:bg-[#f5f2ea] hover:text-[#45443e]",
                  ].join(" ")}
                >
                  <Icon size={14} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Settings */}
          <div className="mt-8 border-t border-[#eeeae0] pt-4">
            <Link
              href="/settings"
              onClick={onClose}
              className={[
                "flex h-[35px] items-center gap-2.5 rounded-[8px] px-3",
                "text-[11px] font-medium transition-colors",
                pathname.startsWith("/settings")
                  ? "bg-[#eeece5] text-[#34342f]"
                  : "text-[#85837a] hover:bg-[#f5f2ea]",
              ].join(" ")}
            >
              <Settings size={14} strokeWidth={1.7} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* School card */}
        <div className="rounded-[12px] bg-[#f3f0e8] p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#66735c]">
              D
            </div>

            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold text-[#494841]">
                Delhi Public School
              </p>

              <p className="mt-0.5 truncate text-[8px] text-[#96938a]">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
