import { z } from "zod";

export const gradingResultSchema = z.object({
  questionId: z.string(),
  score: z.number().min(0),
  maxMarks: z.number().min(0),
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const answerGradingSchema = z.object({
  results: z.array(gradingResultSchema),
});

export const answerGradingJsonSchema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionId: {
            type: "string",
          },
          score: {
            type: "number",
          },
          maxMarks: {
            type: "number",
          },
          feedback: {
            type: "string",
          },
          strengths: {
            type: "array",
            items: {
              type: "string",
            },
          },
          improvements: {
            type: "array",
            items: {
              type: "string",
            },
          },
          confidence: {
            type: "number",
          },
        },
        required: [
          "questionId",
          "score",
          "maxMarks",
          "feedback",
          "strengths",
          "improvements",
          "confidence",
        ],
      },
    },
  },
  required: ["results"],
};