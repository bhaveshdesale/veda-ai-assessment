import type {
  AssessmentQuestion,
  UnmatchedAnswer,
} from "@/types/assessment";

import type {
  AssessmentProcessingResult,
} from "@/types/processing";

export function buildAssessmentQuestions(
  result: AssessmentProcessingResult,
): AssessmentQuestion[] {
  return result.questions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((question) => {
      const mapping =
        result.mappings.find(
          (item) =>
            item.questionId ===
            question.id,
        );

      const answer = mapping?.answerId
        ? result.answers.find(
            (item) =>
              item.id ===
              mapping.answerId,
          )
        : undefined;

      const grading =
        result.grading.find(
          (item) =>
            item.questionId ===
            question.id,
        );

      const score =
        grading?.score ?? 0;

      const maxMarks =
        question.marks ?? 0;

      let status:
        | "answered"
        | "unanswered"
        | "review";

      if (!answer) {
        status = "unanswered";
      } else if (
        mapping?.status ===
          "needs-review" ||
        (grading &&
          grading.confidence < 0.7)
      ) {
        status = "review";
      } else {
        status = "answered";
      }

      return {
        id: question.id,

        number: question.number,

        text: question.text,

        marks: maxMarks,

        score,

        status,

        answer:
          answer?.text ?? null,

        answerMatch: answer
          ? {
              answerId: answer.id,

              confidence:
                mapping?.confidence ??
                answer.confidence,

              method:
                mapping?.method ??
                "combined",

              regions:
                answer.regions,

              status:
                mapping?.status ??
                "mapped",
            }
          : null,

        page: question.page,

        region: question.region,
      };
    });
}

export function buildUnmatchedAnswers(
  result: AssessmentProcessingResult,
): UnmatchedAnswer[] {
  return result.answers
    .filter(
      (answer) =>
        !answer.questionNumber,
    )
    .map((answer) => ({
      id: answer.id,

      text: answer.text,

      page:
        answer.pages[0] ?? 1,

      confidence:
        answer.confidence,

      regions:
        answer.regions,
    }));
}