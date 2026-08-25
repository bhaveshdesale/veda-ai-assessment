import type { AssessmentQuestion } from "@/types/assessment";

type FeedbackCardProps = {
  question: AssessmentQuestion;
  percentage: number;
};

export function FeedbackCard({
  question,
  percentage,
}: FeedbackCardProps) {
  if (question.status === "unanswered") {
    return (
      <div className="rounded-[12px] border border-[#eadfd6] bg-[#fff8f3] p-4">
        <p className="text-[9px] font-semibold text-[#9b654f]">
          Assessment Status
        </p>

        <p className="mt-2 text-[10px] leading-5 text-[#8c766b]">
          This question appears to be unanswered.
          No marks were awarded.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#ebe7dd] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold text-[#34342f]">
          AI Feedback
        </p>

        <span className="text-[8px] font-semibold text-[#6d8c63]">
          {percentage}% match
        </span>
      </div>

      <p className="mt-2 text-[10px] leading-5 text-[#77746c]">
        The response addresses the main concept correctly.
        Consider adding a more specific explanation or example
        where required.
      </p>
    </div>
  );
}