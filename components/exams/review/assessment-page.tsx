"use client";

import { useMemo, useState } from "react";
import { AssessmentHeader } from "./assessment-header";
import { AnswerSheetViewer } from "./answer-sheet-viewer";
import { QuestionDetail } from "./question-detial";
import { QuestionList } from "./question-list";
import { assessmentQuestions } from "./mock-assessment";

export function AssessmentPage() {
  const [selectedId, setSelectedId] = useState(
    assessmentQuestions[0].id,
  );

  const selectedQuestion = useMemo(
    () =>
      assessmentQuestions.find(
        (question) => question.id === selectedId,
      ) ?? assessmentQuestions[0],
    [selectedId],
  );

  const answered = assessmentQuestions.filter(
    (question) => question.status === "answered",
  ).length;

  const unanswered = assessmentQuestions.filter(
    (question) => question.status === "unanswered",
  ).length;

  const review = assessmentQuestions.filter(
    (question) => question.status === "review",
  ).length;

  return (
    <section className="h-[calc(100vh-64px)] overflow-hidden p-3 sm:p-5">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-[#fffdf8] shadow-[0_3px_15px_rgba(70,60,40,0.05)]">
        <AssessmentHeader
          total={assessmentQuestions.length}
          answered={answered}
          unanswered={unanswered}
          review={review}
        />

        <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_minmax(320px,1fr)_minmax(380px,1.15fr)]">
          <QuestionList
            questions={assessmentQuestions}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <QuestionDetail question={selectedQuestion} />

          <AnswerSheetViewer
            question={selectedQuestion}
          />
        </div>
      </div>
    </section>
  );
}