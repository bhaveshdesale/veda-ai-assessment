export const ACCEPTED_FILE_EXTENSIONS =
  ".pdf,.png,.jpg,.jpeg";

export const PROCESSING_STEPS = [
  {
    id: "reading-question-paper",
    label: "Reading question paper",
    description:
      "Analyzing the uploaded question paper.",
  },
  {
    id: "extracting-questions",
    label: "Extracting questions",
    description:
      "Identifying questions, sub-parts and marks.",
  },
  {
    id: "reading-answer-sheet",
    label: "Reading answer sheet",
    description:
      "Detecting student responses from the answer sheet.",
  },
  {
    id: "mapping-answers",
    label: "Mapping answers",
    description:
      "Associating student responses with questions.",
  },
  {
    id: "preparing-assessment",
    label: "Preparing assessment",
    description:
      "Building the final assessment for review.",
  },
] as const;