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

export type AssessmentQuestion = {
  id: string;
  number: string;
  text: string;
  marks: number;
  score: number;
  status: QuestionStatus;
  answer: string | null;
  answerRegions: AnswerRegion[];
};