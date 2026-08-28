import type {
  ExtractedQuestion,
  ExtractedAnswer,
} from "./extraction";

import type { AnswerMapping } from "./mapping";

import type {
  GradingResult,
} from "./grading";

export type ProcessingStepStatus =
  | "pending"
  | "processing"
  | "completed"
  | "error";

export type ProcessingStep = {
  id: string;
  label: string;
  description: string;
  status: ProcessingStepStatus;
};

export type AssessmentProcessingResult = {
  questions: ExtractedQuestion[];
  answers: ExtractedAnswer[];
  mappings: AnswerMapping[];
  grading: GradingResult[];
};


