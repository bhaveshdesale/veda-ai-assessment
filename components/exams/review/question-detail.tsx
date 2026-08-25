import type { AssessmentQuestion } from "@/types/assessment";

import { FeedbackCard } from "./feedback-card";
import { OverallFeedback } from "./overall-feedback";

type QuestionDetailProps = {
  question: AssessmentQuestion;
  showOverallFeedback?: boolean;
};

export function QuestionDetail({
  question,
  showOverallFeedback = false,
}: QuestionDetailProps) {
  const percentage =
    question.marks === 0
      ? 0
      : Math.round(
          (question.score / question.marks) *
            100,
        );

  const confidence =
    question.answerMatch
      ? Math.round(
          question.answerMatch.confidence *
            100,
        )
      : null;

  return (
    <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#343530] px-3 py-1.5 text-[8px] font-semibold text-white">
          Question {question.number}
        </span>

        <span className="text-[9px] font-semibold text-[#34342f]">
          {question.score}/{question.marks}
        </span>
      </div>

      <h2 className="mt-5 text-[16px] font-bold leading-6 text-[#34342f]">
        {question.text}
      </h2>

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#99968c]">
            Student Answer
          </p>

          {confidence !== null && (
            <span
              className={[
                "text-[8px] font-semibold",
                confidence >= 85
                  ? "text-[#6d8c63]"
                  : confidence >= 70
                    ? "text-[#b18454]"
                    : "text-[#d87554]",
              ].join(" ")}
            >
              {confidence}% mapping confidence
            </span>
          )}
        </div>

        {question.answer ? (
          <div className="mt-3 rounded-[12px] bg-[#f5f2ea] p-4">
            <p className="text-[10px] leading-6 text-[#56544d]">
              {question.answer}
            </p>

            {question.answerMatch &&
              question.answerMatch.regions.length >
                1 && (
                <p className="mt-3 text-[8px] font-medium text-[#99968c]">
                  Answer continues across{" "}
                  {question.answerMatch.regions.length}{" "}
                  pages/regions.
                </p>
              )}
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

      {showOverallFeedback && (
        <OverallFeedback />
      )}
    </div>
  );
}