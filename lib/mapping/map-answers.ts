import type {
  ExtractedAnswer,
  ExtractedQuestion,
} from "@/types/extraction";

import type {
  AnswerMapping,
} from "@/types/mapping";

import {
  mapByQuestionNumber,
} from "./question-number-mapper";

import {
  mapBySpatialPosition,
} from "./spatial-mapper";

export function mapAnswers(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): AnswerMapping[] {
  /*
   * 1. Match using explicit question
   * number.
   */
  const numberMappings =
    mapByQuestionNumber(
      questions,
      answers,
    );

  /*
   * 2. Use page/position for
   * questions still unresolved.
   */
  const spatialMappings =
    mapBySpatialPosition(
      questions,
      answers,
      numberMappings,
    );

  const finalMappings = [
    ...spatialMappings,
  ];

  const mappedQuestionIds =
    new Set(
      finalMappings.map(
        (mapping) =>
          mapping.questionId,
      ),
    );

  const mappedAnswerIds =
    new Set(
      finalMappings
        .filter(
          (mapping) =>
            mapping.answerId !==
            null,
        )
        .map(
          (mapping) =>
            mapping.answerId!,
        ),
    );

  /*
   * 3. Every question must have
   * an entry.
   */
  for (const question of questions) {
    if (
      mappedQuestionIds.has(
        question.id,
      )
    ) {
      continue;
    }

    finalMappings.push({
      questionId: question.id,

      answerId: null,

      confidence: 1,

      method: "question-number",

      regions: [],

      status: "unanswered",
    });
  }

  /*
   * 4. Every answer that wasn't
   * associated with a question
   * becomes unmatched.
   */
  for (const answer of answers) {
    if (
      mappedAnswerIds.has(
        answer.id,
      )
    ) {
      continue;
    }

    /*
     * An unmatched answer does not
     * have a questionId, so it cannot
     * be represented directly by the
     * current AnswerMapping type.
     *
     * We intentionally don't create a
     * fake questionId here.
     *
     * The existing UnmatchedAnswer
     * collection will represent these
     * answers in the review UI.
     */
  }

  /*
   * 5. Keep the final mappings in
   * question order.
   */
  const questionOrder =
    new Map(
      questions.map(
        (question) => [
          question.id,
          question.order,
        ],
      ),
    );

  finalMappings.sort(
    (a, b) =>
      (questionOrder.get(
        a.questionId,
      ) ?? 0) -
      (questionOrder.get(
        b.questionId,
      ) ?? 0),
  );

  return finalMappings;
}