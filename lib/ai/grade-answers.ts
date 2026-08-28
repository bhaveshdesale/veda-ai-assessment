import "server-only";

import { gemini } from "./gemini";
import { GEMINI_MODEL } from "./config";

import { ANSWER_GRADING_PROMPT } from "./prompts/answer-grading";

import {
  answerGradingSchema,
  answerGradingJsonSchema,
} from "./schemas/answer-grading";

import type { AssessmentGradingResult } from "@/types/grading";

type QuestionToGrade = {
  questionId: string;
  question: string;
  answer: string | null;
  maxMarks: number;
};

export async function gradeAnswers(
  questions: QuestionToGrade[],
): Promise<AssessmentGradingResult> {
  if (questions.length === 0) {
    return {
      results: [],
    };
  }

  const gradingInput = questions.map((item) => ({
    questionId: item.questionId,
    question: item.question,
    studentAnswer: item.answer ?? "No answer provided.",
    maxMarks: item.maxMarks,
  }));

  console.log(
    `Sending ${questions.length} answers to ${GEMINI_MODEL} for grading...`,
  );

  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,

    contents: [
      {
        text: `${ANSWER_GRADING_PROMPT}

Grade the following student answers:

${JSON.stringify(gradingInput, null, 2)}`,
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseJsonSchema: answerGradingJsonSchema,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty grading response.");
  }

  console.log(`Gemini grading succeeded with ${GEMINI_MODEL}`);

  let parsedResponse: unknown;

  try {
    parsedResponse = JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid grading JSON.");
  }

  const validationResult = answerGradingSchema.safeParse(parsedResponse);

  if (!validationResult.success) {
    console.error("Gemini grading validation failed:", validationResult.error);

    throw new Error("Gemini returned an invalid grading response.");
  }

  const results = validationResult.data.results.map((result) => {
    const question = questions.find(
      (item) => item.questionId === result.questionId,
    );

    const maxMarks = question?.maxMarks ?? result.maxMarks;

    const score = Math.min(Math.max(result.score, 0), maxMarks);

    return {
      ...result,
      score,
      maxMarks,
    };
  });

  return {
    results,
  };
}
