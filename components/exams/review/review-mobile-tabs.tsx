"use client";

type ReviewTab =
  | "questions"
  | "answer"
  | "sheet";

type ReviewMobileTabsProps = {
  activeTab: ReviewTab;
  onChange: (tab: ReviewTab) => void;
};

const tabs: {
  id: ReviewTab;
  label: string;
}[] = [
  {
    id: "questions",
    label: "Questions",
  },
  {
    id: "answer",
    label: "Answer",
  },
  {
    id: "sheet",
    label: "Answer Sheet",
  },
];

export function ReviewMobileTabs({
  activeTab,
  onChange,
}: ReviewMobileTabsProps) {
  return (
    <div className="flex shrink-0 border-b border-[#ebe7dd] bg-[#fffdf8] lg:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "relative flex-1 py-3 text-[8px] font-semibold",
            activeTab === tab.id
              ? "text-[#f15b32]"
              : "text-[#99968c]",
          ].join(" ")}
        >
          {tab.label}

          {activeTab === tab.id && (
            <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[#f15b32]" />
          )}
        </button>
      ))}
    </div>
  );
}