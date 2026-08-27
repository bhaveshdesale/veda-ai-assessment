import type {
  ExtractedAnswer,
  ExtractedQuestion,
} from "@/types/extraction";

import type {
  AnswerMapping,
} from "@/types/mapping";

function normalizeQuestionNumber(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.)]+/g, "")
    .trim();
}

export function mapByQuestionNumber(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): AnswerMapping[] {
  const mappings: AnswerMapping[] = [];

  const usedAnswerIds =
    new Set<string>();

  for (const question of questions) {
    const normalizedQuestion =
      normalizeQuestionNumber(
        question.number,
      );

    const matchingAnswer =
      answers.find((answer) => {
        if (
          usedAnswerIds.has(
            answer.id,
          )
        ) {
          return false;
        }

        const normalizedAnswer =
          normalizeQuestionNumber(
            answer.questionNumber,
          );

        return (
          normalizedAnswer ===
          normalizedQuestion
        );
      });

    if (!matchingAnswer) {
      continue;
    }

    usedAnswerIds.add(
      matchingAnswer.id,
    );

    mappings.push({
      questionId: question.id,

      answerId: matchingAnswer.id,

      confidence:
        matchingAnswer.confidence,

      method: "question-number",

      regions:
        matchingAnswer.regions,

      status:
        matchingAnswer.confidence >=
        0.8
          ? "mapped"
          : "needs-review",
    });
  }

  return mappings;
}