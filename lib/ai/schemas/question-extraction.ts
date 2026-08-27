import { z } from "zod";

const answerRegionSchema = z.object({
  page: z.number().int().positive(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
});

const extractedQuestionSchema = z.object({
  id: z.string(),
  number: z.string(),
  text: z.string(),
  marks: z.number().nullable(),
  order: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  region: answerRegionSchema,
});

export const questionExtractionSchema =
  z.object({
    questions: z.array(
      extractedQuestionSchema,
    ),
    documentPages: z.number().int().positive(),
  });

export const questionExtractionJsonSchema = {
  type: "object",

  properties: {
    questions: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "string",
          },

          number: {
            type: "string",
          },

          text: {
            type: "string",
          },

          marks: {
            anyOf: [
              {
                type: "number",
              },
              {
                type: "null",
              },
            ],
          },

          order: {
            type: "integer",
          },

          page: {
            type: "integer",
          },

          region: {
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

        required: [
          "id",
          "number",
          "text",
          "marks",
          "order",
          "page",
          "region",
        ],
      },
    },

    documentPages: {
      type: "integer",
    },
  },

  required: [
    "questions",
    "documentPages",
  ],
};