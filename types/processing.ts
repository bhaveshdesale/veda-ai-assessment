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

export type ProcessingState =
  | "processing"
  | "completed"
  | "error";