export type AnswerRegion = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AssessmentQuestionStatus =
  | "answered"
  | "unanswered"
  | "review";

export type AssessmentAnswerMatch = {
  answerId: string;
  confidence: number;
  method:
    | "question-number"
    | "spatial"
    | "semantic"
    | "combined";
  regions: AnswerRegion[];
  status:
    | "mapped"
    | "needs-review"
    | "unanswered"
    | "unmatched";
};

export type AssessmentQuestion = {
  id: string;
  number: string;
  text: string;
  marks: number;
  score: number;
  status: AssessmentQuestionStatus;
  answer: string | null;
  answerMatch: AssessmentAnswerMatch | null;
  page: number;
  region: AnswerRegion;
};

export type UnmatchedAnswer = {
  id: string;
  text: string;
  page: number;
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