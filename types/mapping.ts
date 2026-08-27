import type {
  AnswerRegion,
} from "./assessment";

export type MappingMethod =
  | "question-number"
  | "spatial"
  | "semantic"
  | "combined";

export type AnswerMapping = {
  questionId: string;

  answerId: string | null;

  confidence: number;

  method: MappingMethod;

  regions: AnswerRegion[];

  status:
    | "mapped"
    | "needs-review"
    | "unanswered"
    | "unmatched";
};