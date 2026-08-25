import type {
  AssessmentQuestion,
  UnmatchedAnswer,
} from "@/types/assessment";

import { QuestionItem } from "./question-item";
import { UnmatchedAnswers } from "./unmatched-answers";

type QuestionListProps = {
  questions: AssessmentQuestion[];
  unmatchedAnswers: UnmatchedAnswer[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSelectUnmatched: (
    answer: UnmatchedAnswer,
  ) => void;
};

export function QuestionList({
  questions,
  unmatchedAnswers,
  selectedId,
  onSelect,
  onSelectUnmatched,
}: QuestionListProps) {
  return (
    <aside className="min-h-0 overflow-y-auto border-b border-[#ebe7dd] p-3 lg:border-b-0 lg:border-r">
      <div className="mb-2 px-2 py-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#99968c]">
          Questions
        </p>

        <p className="mt-1 text-[8px] text-[#aaa69d]">
          {questions.length} extracted
        </p>
      </div>

      <div className="space-y-1">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            selected={question.id === selectedId}
            onClick={() => onSelect(question.id)}
          />
        ))}
      </div>

      <UnmatchedAnswers
        answers={unmatchedAnswers}
        onSelect={onSelectUnmatched}
      />
    </aside>
  );
}