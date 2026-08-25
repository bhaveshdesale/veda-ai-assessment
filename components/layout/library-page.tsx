import { FileText, Folder } from "lucide-react";

const folders = [
  ["Question Papers", "24 files"],
  ["Answer Sheets", "18 files"],
  ["Study Material", "32 files"],
  ["Assignments", "16 files"],
];

export function LibraryPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 sm:p-8 lg:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f15b32]">
        Resources
      </p>

      <h1 className="mt-2 text-[28px] font-bold tracking-[-0.05em] text-[#34342f]">
        My Library
      </h1>

      <p className="mt-2 text-[11px] text-[#85837a]">
        Your teaching resources and assessment material.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map(([name, count]) => (
          <button
            type="button"
            key={name}
            className="rounded-[16px] bg-[#fffdf8] p-5 text-left shadow-[0_2px_12px_rgba(70,60,40,0.05)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f1eee6] text-[#77746c]">
              <Folder size={17} />
            </div>

            <h2 className="mt-5 text-[12px] font-semibold text-[#34342f]">
              {name}
            </h2>

            <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#99968c]">
              <FileText size={11} />
              {count}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}