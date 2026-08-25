import {
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";

import type { AssessmentQuestion } from "@/types/assessment";

type QuestionItemProps = {
  question: AssessmentQuestion;
  selected: boolean;
  onClick: () => void;
};

export function QuestionItem({
  question,
  selected,
  onClick,
}: QuestionItemProps) {
  const isAnswered =
    question.status === "answered";

  const isReview =
    question.status === "review";

  const isUnanswered =
    question.status === "unanswered";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-[10px] p-3 text-left",
        "transition-colors",
        selected
          ? "bg-[#fff0e8]"
          : "hover:bg-[#f5f2ea]",
      ].join(" ")}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={[
            "flex h-6 min-w-6 items-center justify-center rounded-full",
            "text-[8px] font-bold",
            selected
              ? "bg-[#f15b32] text-white"
              : "bg-[#eeece5] text-[#5f5d56]",
          ].join(" ")}
        >
          {question.number}
        </span>

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[9px] font-medium leading-4 text-[#45433d]">
            {question.text}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            {isAnswered && (
              <>
                <CheckCircle2
                  size={10}
                  className="text-[#6d8c63]"
                />

                <span className="text-[8px] font-semibold text-[#6d8c63]">
                  {question.score}/{question.marks}
                </span>
              </>
            )}

            {isReview && (
              <>
                <AlertCircle
                  size={10}
                  className="text-[#e36b44]"
                />

                <span className="text-[8px] font-semibold text-[#e36b44]">
                  Needs review
                </span>
              </>
            )}

            {isUnanswered && (
              <>
                <Circle
                  size={10}
                  className="text-[#b5b1a8]"
                />

                <span className="text-[8px] font-semibold text-[#aaa69d]">
                  Unanswered
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}