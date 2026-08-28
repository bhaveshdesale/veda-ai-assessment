export type GradingResult = {
  questionId: string;
  score: number;
  maxMarks: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  confidence: number;
};

export type AssessmentGradingResult = {
  results: GradingResult[];
};