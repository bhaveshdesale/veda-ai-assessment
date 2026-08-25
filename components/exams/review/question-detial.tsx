import type { AssessmentQuestion } from "@/types/assessment";
import { FeedbackCard } from "./feedback-card";

type QuestionDetailProps = {
  question: AssessmentQuestion;
};

export function QuestionDetail({
  question,
}: QuestionDetailProps) {
  const percentage =
    question.marks === 0
      ? 0
      : Math.round(
          (question.score / question.marks) * 100,
        );

  return (
    <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#343530] px-3 py-1.5 text-[8px] font-semibold text-white">
          Question {question.number}
        </span>

        <span
          className={[
            "text-[9px] font-semibold",
            question.status === "answered"
              ? "text-[#6d8c63]"
              : question.status === "review"
                ? "text-[#e36b44]"
                : "text-[#b5775d]",
          ].join(" ")}
        >
          {question.score}/{question.marks}
        </span>
      </div>

      <h2 className="mt-5 text-[16px] font-bold leading-6 text-[#34342f]">
        {question.text}
      </h2>

      <div className="mt-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#99968c]">
          Student Answer
        </p>

        {question.answer ? (
          <div className="mt-3 rounded-[12px] bg-[#f5f2ea] p-4">
            <p className="text-[10px] leading-6 text-[#56544d]">
              {question.answer}
            </p>
          </div>
        ) : (
          <div className="mt-3 rounded-[12px] border border-dashed border-[#d8d2c5] bg-[#faf8f2] p-5">
            <p className="text-[10px] italic text-[#aaa69d]">
              No answer detected for this question.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <FeedbackCard
          question={question}
          percentage={percentage}
        />
      </div>
    </div>
  );
}