import { z } from "zod";

export const questionSchema = z.object({
  number: z.string().min(1),

  text: z.string().min(1),

  marks: z.number().nullable(),

  order: z.number().int().nonnegative(),

  page: z.number().int().positive(),
});

export const questionExtractionSchema =
  z.object({
    questions: z
      .array(questionSchema)
      .min(1),
  });

export const questionExtractionJsonSchema = {
  type: "object",

  properties: {
    questions: {
      type: "array",

      items: {
        type: "object",

        properties: {
          number: {
            type: "string",
          },

          text: {
            type: "string",
          },

          marks: {
            type: ["number", "null"],
          },

          order: {
            type: "integer",
          },

          page: {
            type: "integer",
          },
        },

        required: [
          "number",
          "text",
          "marks",
          "order",
          "page",
        ],
      },
    },
  },

  required: ["questions"],
};