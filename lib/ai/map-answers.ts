import type {
  ExtractedAnswer,
  ExtractedQuestion,
} from "@/types/extraction";

import type {
  AnswerMapping,
} from "@/types/mapping";

export type MappingResult = {
  mappings: AnswerMapping[];
  unmatchedAnswers: ExtractedAnswer[];
};

function normalizeQuestionNumber(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^q\.?\s*/i, "")
    .replace(/\s+/g, "");
}

export function mapAnswers(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): MappingResult {
  const answersByQuestion =
    new Map<
      string,
      ExtractedAnswer[]
    >();

  const unmatchedAnswers: ExtractedAnswer[] =
    [];

  /*
   * First pass:
   * Group answers by their extracted
   * question number.
   */
  for (const answer of answers) {
    if (!answer.questionNumber) {
      unmatchedAnswers.push(answer);
      continue;
    }

    const normalizedNumber =
      normalizeQuestionNumber(
        answer.questionNumber,
      );

    const existing =
      answersByQuestion.get(
        normalizedNumber,
      ) ?? [];

    existing.push(answer);

    answersByQuestion.set(
      normalizedNumber,
      existing,
    );
  }

  /*
   * Second pass:
   * Create one mapping for every question.
   */
  const mappings: AnswerMapping[] =
    questions.map((question) => {
      const normalizedQuestionNumber =
        normalizeQuestionNumber(
          question.number,
        );

      const candidates =
        answersByQuestion.get(
          normalizedQuestionNumber,
        ) ?? [];

      /*
       * No answer was found.
       */
      if (candidates.length === 0) {
        return {
          questionId: question.id,

          answerId: null,

          confidence: 1,

          method: "question-number",

          regions: [],

          status: "unanswered",
        };
      }

      /*
       * More than one answer claims
       * to belong to the same question.
       *
       * We should not silently choose
       * between them.
       */
      if (candidates.length > 1) {
        const bestAnswer =
          [...candidates].sort(
            (a, b) =>
              b.confidence -
              a.confidence,
          )[0];

        for (const candidate of candidates) {
          if (
            candidate.id !==
            bestAnswer.id
          ) {
            unmatchedAnswers.push(
              candidate,
            );
          }
        }

        return {
          questionId: question.id,

          answerId: bestAnswer.id,

          confidence:
            bestAnswer.confidence,

          method: "question-number",

          regions:
            bestAnswer.regions,

          status: "needs-review",
        };
      }

      /*
       * Exactly one answer matched.
       */
      const answer =
        candidates[0];

      return {
        questionId: question.id,

        answerId: answer.id,

        confidence:
          answer.confidence,

        method: "question-number",

        regions:
          answer.regions,

        status:
          answer.confidence >= 0.8
            ? "mapped"
            : "needs-review",
      };
    });

  /*
   * Safety pass:
   *
   * Any answer that was not used by a
   * question mapping becomes unmatched.
   */
  const mappedAnswerIds =
    new Set(
      mappings
        .map(
          (mapping) =>
            mapping.answerId,
        )
        .filter(
          (
            answerId,
          ): answerId is string =>
            answerId !== null,
        ),
    );

  for (const answer of answers) {
    const alreadyUnmatched =
      unmatchedAnswers.some(
        (item) =>
          item.id === answer.id,
      );

    if (
      !mappedAnswerIds.has(
        answer.id,
      ) &&
      !alreadyUnmatched
    ) {
      unmatchedAnswers.push(answer);
    }
  }

  return {
    mappings,
    unmatchedAnswers,
  };
}