import { AlertCircle } from "lucide-react";

import type { UnmatchedAnswer } from "@/types/assessment";

type UnmatchedAnswersProps = {
  answers: UnmatchedAnswer[];
  onSelect: (answer: UnmatchedAnswer) => void;
};

export function UnmatchedAnswers({
  answers,
  onSelect,
}: UnmatchedAnswersProps) {
  if (answers.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-[#ebe7dd] pt-3">
      <div className="mb-2 px-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#99968c]">
          Unmatched Answers
        </p>

        <p className="mt-1 text-[8px] leading-4 text-[#aaa69d]">
          These responses could not be confidently
          mapped to a question.
        </p>
      </div>

      <div className="space-y-1">
        {answers.map((answer) => (
          <button
            key={answer.id}
            type="button"
            onClick={() => onSelect(answer)}
            className="w-full rounded-[10px] bg-[#fff8f3] p-3 text-left transition-colors hover:bg-[#fff0e8]"
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-[#d87554]"
              />

              <div className="min-w-0">
                <p className="text-[8px] font-semibold text-[#9d654f]">
                  Page {answer.page}
                </p>

                <p className="mt-1 line-clamp-2 text-[8px] leading-4 text-[#8c766b]">
                  {answer.text}
                </p>

                <p className="mt-1 text-[7px] text-[#b19487]">
                  {Math.round(
                    answer.confidence * 100,
                  )}
                  % mapping confidence
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}