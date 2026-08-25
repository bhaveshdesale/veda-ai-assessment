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
  const statusLabel = {
    answered: `${question.score}/${question.marks}`,
    unanswered: "Unanswered",
    review: "Review",
  }[question.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-[10px] p-3 text-left transition-colors",
        selected
          ? "bg-[#fff0e8]"
          : "hover:bg-[#f5f2ea]",
      ].join(" ")}
    >
      <div className="flex gap-2.5">
        <span
          className={[
            "flex h-6 min-w-6 items-center justify-center rounded-full text-[8px] font-bold",
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

          <p
            className={[
              "mt-1.5 text-[8px] font-semibold",
              question.status === "answered"
                ? "text-[#6d8c63]"
                : question.status === "review"
                  ? "text-[#e36b44]"
                  : "text-[#b5775d]",
            ].join(" ")}
          >
            {statusLabel}
          </p>
        </div>
      </div>
    </button>
  );
}