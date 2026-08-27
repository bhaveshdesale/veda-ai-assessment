import type { AnswerRegion } from "./assessment";

export type ExtractedQuestion = {
  id: string;

  number: string;

  text: string;

  marks: number | null;

  order: number;

  page: number;
};

export type ExtractedAnswer = {
  id: string;

  questionNumber: string | null;

  text: string;

  regions: AnswerRegion[];

  pages: number[];

  order: number;

  confidence: number;
};

export type QuestionExtractionResult = {
  questions: ExtractedQuestion[];

  documentPages: number;
};

export type AnswerExtractionResult = {
  answers: ExtractedAnswer[];
};