import "server-only";

import { gemini } from "./gemini";
import { GEMINI_MODEL } from "./config";

import {
  ANSWER_EXTRACTION_PROMPT,
} from "./prompts/answer-extraction";

import {
  answerExtractionSchema,
  answerExtractionJsonSchema,
} from "./schemas/answer-extraction";

import type {
  AnswerExtractionResult,
} from "@/types/extraction";

export async function extractAnswers(
  file: File,
): Promise<AnswerExtractionResult> {
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
            ANSWER_EXTRACTION_PROMPT,
        },
      ],

      config: {
        responseMimeType:
          "application/json",

        responseJsonSchema:
          answerExtractionJsonSchema,
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

  console.log(
    "Gemini raw response:",
    response.text,
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
    answerExtractionSchema.safeParse(
      parsedResponse,
    );

  if (!validationResult.success) {
    console.error(
      "Gemini answer response validation failed:",
      validationResult.error,
    );

    throw new Error(
      "Gemini returned an invalid answer extraction response.",
    );
  }

  const answers =
    validationResult.data.answers.map(
      (answer, index) => ({
        id:
          answer.id ||
          `answer-${index + 1}`,

        questionNumber:
          answer.questionNumber,

        text: answer.text,

        regions: answer.regions,

        pages: answer.pages,

        order: answer.order,

        confidence:
          answer.confidence,
      }),
    );

  const documentPages =
    answers.length === 0
      ? 0
      : Math.max(
          ...answers.flatMap(
            (answer) => answer.pages,
          ),
        );

  return {
    answers,
    documentPages,
  };
}