export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export const ACCEPTED_FILE_EXTENSIONS =
  ".pdf,.jpg,.jpeg,.png";


  export const PROCESSING_STEPS = [
  {
    id: "question-paper",
    label: "Reading question paper",
    description: "Analyzing the uploaded question paper.",
  },
  {
    id: "question-extraction",
    label: "Extracting questions",
    description: "Identifying questions and sub-parts.",
  },
  {
    id: "answer-sheet",
    label: "Reading answer sheet",
    description: "Analyzing the student's handwritten responses.",
  },
  {
    id: "answer-mapping",
    label: "Mapping answers",
    description: "Matching answers with their questions.",
  },
  {
    id: "assessment",
    label: "Preparing assessment",
    description: "Preparing the assessment review.",
  },
] as const;