export type QuestionStatus =
  | "answered"
  | "unanswered"
  | "review";

export type AnswerRegion = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AnswerMatch = {
  answerId: string;
  confidence: number;
  regions: AnswerRegion[];
};

export type AssessmentQuestion = {
  id: string;
  number: string;
  text: string;
  marks: number;
  score: number;
  status: QuestionStatus;
  answer: string | null;
  answerMatch: AnswerMatch | null;
};

export type UnmatchedAnswer = {
  id: string;
  page: number;
  text: string;
  confidence: number;
  regions: AnswerRegion[];
};

export type AssessmentSummary = {
  totalMarks: number;
  obtainedMarks: number;
  answered: number;
  unanswered: number;
  needsReview: number;
  unmatched: number;
};