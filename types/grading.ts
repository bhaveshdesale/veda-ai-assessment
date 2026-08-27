export type GradeResult = {
  questionId: string;
  score: number;
  maxScore: number;
  feedback: string;
  confidence: number;
};

export type AssessmentSummary = {
  totalMarks: number;
  obtainedMarks: number;
  answered: number;
  unanswered: number;
  needsReview: number;
  unmatched: number;
};

export type AssessmentResult = {
  questions: unknown[];
  answers: unknown[];
  mappings: unknown[];
  grades: GradeResult[];
  summary: AssessmentSummary;
};