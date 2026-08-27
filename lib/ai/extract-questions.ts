import "server-only";

import { gemini } from "./gemini";
import { GEMINI_MODEL } from "./config";

import {
  QUESTION_EXTRACTION_PROMPT,
} from "./prompts/question-extraction";

import {
  questionExtractionSchema,
  questionExtractionJsonSchema,
} from "./schemas/question-extraction";

import type {
  QuestionExtractionResult,
} from "@/types/extraction";

export async function extractQuestions(
  file: File,
): Promise<QuestionExtractionResult> {
  const buffer = Buffer.from(
    await file.arrayBuffer(),
  );

  const base64 =
    buffer.toString("base64");

  console.log(
    `Sending ${file.name} to ${GEMINI_MODEL}...`,
  );

  const response =
    await gemini.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64,
          },
        },
        {
          text:
            QUESTION_EXTRACTION_PROMPT,
        },
      ],

      config: {
        responseMimeType:
          "application/json",

        responseJsonSchema:
          questionExtractionJsonSchema,
      },
    });

  if (!response.text) {
    throw new Error(
      "Gemini returned an empty response.",
    );
  }

  console.log(
    `Gemini succeeded with ${GEMINI_MODEL}`,
  );

  let parsedResponse: unknown;

  try {
    parsedResponse = JSON.parse(
      response.text,
    );
  } catch {
    throw new Error(
      "Gemini returned invalid JSON.",
    );
  }

  const validationResult =
    questionExtractionSchema.safeParse(
      parsedResponse,
    );

  if (!validationResult.success) {
    console.error(
      "Gemini response validation failed:",
      validationResult.error,
    );

    throw new Error(
      "Gemini returned an invalid question extraction response.",
    );
  }

  const questions =
    validationResult.data.questions.map(
      (question) => ({
        id: `question-${question.order + 1}`,

        number: question.number,

        text: question.text,

        marks: question.marks,

        order: question.order,

        page: question.page,

        region: {
          page: question.page,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
      }),
    );

  const documentPages =
    questions.reduce(
      (maxPage, question) =>
        Math.max(
          maxPage,
          question.page,
        ),
      0,
    );

  return {
    questions,

    documentPages,
  };
}