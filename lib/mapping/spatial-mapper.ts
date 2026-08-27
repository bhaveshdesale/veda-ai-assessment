import type {
  ExtractedAnswer,
  ExtractedQuestion,
} from "@/types/extraction";

import type {
  AnswerMapping,
} from "@/types/mapping";

const MIN_SPATIAL_CONFIDENCE =
  0.55;

const MAX_VERTICAL_DISTANCE =
  35;

function getQuestionPosition(
  question: ExtractedQuestion,
) {
  return {
    page: question.page,
    y: question.region.y,
  };
}

function getAnswerPosition(
  answer: ExtractedAnswer,
) {
  const region =
    answer.regions[0];

  if (!region) {
    return null;
  }

  return {
    page: region.page,
    y: region.y,
  };
}

function calculateConfidence(
  question: ExtractedQuestion,
  answer: ExtractedAnswer,
): number {
  const questionPosition =
    getQuestionPosition(
      question,
    );

  const answerPosition =
    getAnswerPosition(answer);

  if (!answerPosition) {
    return 0;
  }

  /*
   * For now we only use spatial
   * matching when the question and
   * answer are on the same page.
   */
  if (
    questionPosition.page !==
    answerPosition.page
  ) {
    return 0;
  }

  const distance = Math.abs(
    questionPosition.y -
      answerPosition.y,
  );

  if (
    distance >
    MAX_VERTICAL_DISTANCE
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      1,
      1 -
        distance /
          MAX_VERTICAL_DISTANCE,
    ),
  );
}

export function mapBySpatialPosition(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
  existingMappings: AnswerMapping[],
): AnswerMapping[] {
  const mappings = [
    ...existingMappings,
  ];

  const usedAnswerIds =
    new Set(
      mappings
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

  for (const question of questions) {
    const existingMapping =
      mappings.find(
        (mapping) =>
          mapping.questionId ===
          question.id,
      );

    /*
     * Never replace an already
     * successful mapping.
     */
    if (
      existingMapping?.status ===
      "mapped"
    ) {
      continue;
    }

    let bestAnswer:
      | ExtractedAnswer
      | null = null;

    let bestConfidence = 0;

    for (const answer of answers) {
      if (
        usedAnswerIds.has(
          answer.id,
        )
      ) {
        continue;
      }

      const confidence =
        calculateConfidence(
          question,
          answer,
        );

      if (
        confidence >
        bestConfidence
      ) {
        bestConfidence =
          confidence;

        bestAnswer = answer;
      }
    }

    if (
      !bestAnswer ||
      bestConfidence <
        MIN_SPATIAL_CONFIDENCE
    ) {
      continue;
    }

    const mapping: AnswerMapping = {
      questionId:
        question.id,

      answerId:
        bestAnswer.id,

      confidence:
        bestConfidence,

      method: "spatial",

      regions:
        bestAnswer.regions,

      status:
        bestConfidence >= 0.75
          ? "mapped"
          : "needs-review",
    };

    const existingIndex =
      mappings.findIndex(
        (mapping) =>
          mapping.questionId ===
          question.id,
      );

    if (existingIndex >= 0) {
      mappings[existingIndex] =
        mapping;
    } else {
      mappings.push(mapping);
    }

    usedAnswerIds.add(
      bestAnswer.id,
    );
  }

  return mappings;
}