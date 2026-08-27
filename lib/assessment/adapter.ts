import type {
  AssessmentQuestion,
  UnmatchedAnswer,
} from "@/types/assessment";

import type {
  ExtractedAnswer,
  ExtractedQuestion,
} from "@/types/extraction";

import type {
  AnswerMapping,
} from "@/types/mapping";

export function buildAssessmentQuestions(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
  mappings: AnswerMapping[],
): AssessmentQuestion[] {
  return questions
    .sort(
      (a, b) =>
        a.order - b.order,
    )
    .map((question) => {
      const mapping =
        mappings.find(
          (item) =>
            item.questionId ===
            question.id,
        );

      const answer =
        mapping?.answerId
          ? answers.find(
              (item) =>
                item.id ===
                mapping.answerId,
            )
          : undefined;

      const status =
        !answer ||
        mapping?.status ===
          "unanswered"
          ? "unanswered"
          : mapping?.status ===
              "needs-review"
            ? "review"
            : "answered";

      return {
        id: question.id,

        number: question.number,

        text: question.text,

        marks: question.marks ?? 0,

        score: 0,

        status,

        answer:
          answer?.text ??
          null,

        answerMatch:
          mapping &&
          answer
            ? {
                answerId:
                  answer.id,

                confidence:
                  mapping.confidence,

                method:
                  mapping.method,

                regions:
                  mapping.regions,

                status:
                  mapping.status,
              }
            : null,

        page: question.page,

        region: question.region,
      };
    });
}

export function buildUnmatchedAnswers(
  answers: ExtractedAnswer[],
  mappings: AnswerMapping[],
): UnmatchedAnswer[] {
  const mappedAnswerIds =
    new Set(
      mappings
        .filter(
          (mapping) =>
            mapping.answerId !==
            null,
        )
        .map(
          (mapping) =>
            mapping.answerId,
        ),
    );

  return answers
    .filter(
      (answer) =>
        !mappedAnswerIds.has(
          answer.id,
        ),
    )
    .map((answer) => ({
      id: answer.id,

      text: answer.text,

      page:
        answer.pages[0] ??
        1,

      confidence:
        answer.confidence,

      regions:
        answer.regions,
    }));
}