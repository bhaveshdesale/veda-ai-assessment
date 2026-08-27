import {
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";

import type { AssessmentSummary as AssessmentSummaryData } from "@/types/assessment";

type AssessmentSummaryProps = {
  summary: AssessmentSummaryData;
};

export function AssessmentSummary({
  summary,
}: AssessmentSummaryProps) {
  const percentage =
    summary.totalMarks === 0
      ? 0
      : Math.round(
          (summary.obtainedMarks /
            summary.totalMarks) *
            100,
        );

  return (
    <div className="border-b border-[#ebe7dd] bg-[#fffdf8] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#99968c]">
            Assessment Score
          </p>

          <p className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-[#34342f]">
            {summary.obtainedMarks}

            <span className="text-[12px] font-medium text-[#aaa69d]">
              /{summary.totalMarks}
            </span>
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4eedf]">
          <span className="text-[11px] font-bold text-[#61755b]">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <SummaryItem
          icon={<CheckCircle2 size={11} />}
          label="Answered"
          value={summary.answered}
          className="text-[#6d8c63]"
        />

        <SummaryItem
          icon={<Circle size={11} />}
          label="Unanswered"
          value={summary.unanswered}
          className="text-[#99968c]"
        />

        <SummaryItem
          icon={<AlertCircle size={11} />}
          label="Review"
          value={summary.needsReview}
          className="text-[#e36b44]"
        />
      </div>
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-[9px] bg-[#f7f4ed] px-2.5 py-2">
      <div
        className={`flex items-center gap-1 text-[7px] font-semibold ${className}`}
      >
        {icon}
        {label}
      </div>

      <p className="mt-1 text-[12px] font-bold text-[#45433d]">
        {value}
      </p>
    </div>
  );
}