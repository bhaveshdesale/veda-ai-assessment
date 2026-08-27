import { z } from "zod";

const answerRegionSchema = z.object({
  page: z.number().int().positive(),

  x: z.number().min(0).max(100),

  y: z.number().min(0).max(100),

  width: z.number().positive().max(100),

  height: z.number().positive().max(100),
});

const extractedAnswerSchema = z.object({
  questionNumber: z.string().nullable(),

  text: z.string(),

  regions: z.array(answerRegionSchema),

  pages: z
    .array(z.number().int().positive()),

  order: z.number().int().nonnegative(),

  confidence: z.number().min(0).max(1),
});

export const answerExtractionSchema =
  z.object({
    answers: z.array(
      extractedAnswerSchema,
    ),
  });

export const answerExtractionJsonSchema = {
  type: "object",

  properties: {
    answers: {
      type: "array",

      items: {
        type: "object",

        properties: {
          questionNumber: {
            type: ["string", "null"],
          },

          text: {
            type: "string",
          },

          regions: {
            type: "array",

            items: {
              type: "object",

              properties: {
                page: {
                  type: "integer",
                },

                x: {
                  type: "number",
                },

                y: {
                  type: "number",
                },

                width: {
                  type: "number",
                },

                height: {
                  type: "number",
                },
              },

              required: [
                "page",
                "x",
                "y",
                "width",
                "height",
              ],
            },
          },

          pages: {
            type: "array",

            items: {
              type: "integer",
            },
          },

          order: {
            type: "integer",
          },

          confidence: {
            type: "number",
          },
        },

        required: [
          "questionNumber",
          "text",
          "regions",
          "pages",
          "order",
          "confidence",
        ],
      },
    },
  },

  required: ["answers"],
};