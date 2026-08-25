"use client";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  Menu,
} from "lucide-react";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-[48px] shrink-0 items-center justify-between rounded-[12px] bg-[#fffdf8] px-3 shadow-[0_2px_12px_rgba(50,45,30,0.05)] sm:px-4">
      {/* Left */}
      <div className="flex items-center gap-2.5">
        {/* Mobile menu */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#55534c] hover:bg-[#f1eee6] lg:hidden"
        >
          <Menu size={18} strokeWidth={1.8} />
        </button>

        {/* Back */}
        <button
          type="button"
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#55534c] hover:bg-[#f1eee6]"
        >
          <span className="text-[18px] leading-none">←</span>
        </button>

        <div className="hidden h-4 w-px bg-[#e5e1d7] sm:block" />

        <span className="text-[10px] font-medium text-[#99968d]">
          VedaAI
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Help"
          className="hidden h-8 w-8 items-center justify-center rounded-full text-[#65635c] hover:bg-[#f1eee6] sm:flex"
        >
          <CircleHelp size={15} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#65635c] hover:bg-[#f1eee6]"
        >
          <Bell size={15} strokeWidth={1.8} />

          <span className="absolute right-[6px] top-[5px] h-1.5 w-1.5 rounded-full bg-[#f15b32]" />
        </button>

        <div className="ml-1 hidden h-5 w-px bg-[#e5e1d7] sm:block" />

        {/* Avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e1e7dc] text-[7px] font-bold text-[#596650]">
          MR
        </div>

        <span className="hidden text-[9px] font-semibold text-[#494841] md:block">
          Madhur Rastogi
        </span>

        <ChevronDown
          size={12}
          className="text-[#77746c]"
        />
      </div>
    </header>
  );
}