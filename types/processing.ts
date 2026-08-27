import type { ExtractedQuestion } from "./extraction";
import type { ExtractedAnswer } from "./extraction";
import type { AnswerMapping } from "./mapping";

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
};