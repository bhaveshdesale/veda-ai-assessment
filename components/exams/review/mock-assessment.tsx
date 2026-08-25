import type {
  AssessmentQuestion,
  UnmatchedAnswer,
} from "@/types/assessment";

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    number: "1",
    text: "Which of the following organisms is primarily involved in photosynthesis?",
    marks: 2,
    score: 2,
    status: "answered",
    answer:
      "Plants are primarily responsible for photosynthesis because they contain chlorophyll.",
    answerMatch: {
      answerId: "a1",
      confidence: 0.98,
      regions: [
        {
          page: 2,
          x: 12,
          y: 35,
          width: 75,
          height: 14,
        },
      ],
    },
  },

  {
    id: "q2",
    number: "2",
    text: "Which blood vessel carries blood away from the heart?",
    marks: 2,
    score: 2,
    status: "answered",
    answer: "Arteries carry blood away from the heart.",
    answerMatch: {
      answerId: "a2",
      confidence: 0.99,
      regions: [
        {
          page: 3,
          x: 10,
          y: 55,
          width: 72,
          height: 10,
        },
      ],
    },
  },

  {
    id: "q3",
    number: "3",
    text: "Explain the process of photosynthesis.",
    marks: 5,
    score: 4,
    status: "answered",
    answer:
      "Photosynthesis is the process by which green plants use sunlight, carbon dioxide and water to produce glucose and oxygen.",
    answerMatch: {
      answerId: "a3",
      confidence: 0.95,
      regions: [
        {
          page: 4,
          x: 10,
          y: 20,
          width: 78,
          height: 18,
        },
        {
          page: 5,
          x: 10,
          y: 20,
          width: 76,
          height: 17,
        },
      ],
    },
  },

  {
    id: "q4",
    number: "4",
    text: "Describe the role of chloroplasts in plant cells.",
    marks: 2,
    score: 0,
    status: "unanswered",
    answer: null,
    answerMatch: null,
  },

  {
    id: "q5",
    number: "5",
    text: "Explain the process of cellular respiration.",
    marks: 5,
    score: 4,
    status: "answered",
    answer:
      "Cellular respiration releases energy from glucose. It mainly occurs in mitochondria and produces ATP.",
    answerMatch: {
      answerId: "a5",
      confidence: 0.93,
      regions: [
        {
          page: 6,
          x: 11,
          y: 22,
          width: 75,
          height: 27,
        },
      ],
    },
  },

  {
    id: "q6",
    number: "6",
    text: "Describe the transportation system in plants.",
    marks: 3,
    score: 1,
    status: "review",
    answer:
      "Water is transported through the plant using specialized tissues.",
    answerMatch: {
      answerId: "a6",
      confidence: 0.67,
      regions: [
        {
          page: 7,
          x: 10,
          y: 58,
          width: 78,
          height: 15,
        },
      ],
    },
  },

  {
    id: "q11a",
    number: "11(a)",
    text: "Define inheritance.",
    marks: 2,
    score: 2,
    status: "answered",
    answer:
      "Inheritance is the transmission of characteristics from parents to offspring.",
    answerMatch: {
      answerId: "a11a",
      confidence: 0.97,
      regions: [
        {
          page: 9,
          x: 12,
          y: 25,
          width: 76,
          height: 13,
        },
      ],
    },
  },

  {
    id: "q11b",
    number: "11(b)",
    text: "Explain polymorphism with an example.",
    marks: 3,
    score: 1,
    status: "review",
    answer:
      "Polymorphism allows objects of different classes to respond to the same interface.",
    answerMatch: {
      answerId: "a11b",
      confidence: 0.61,
      regions: [
        {
          page: 10,
          x: 11,
          y: 48,
          width: 78,
          height: 22,
        },
      ],
    },
  },
];

export const unmatchedAnswers: UnmatchedAnswer[] = [
  {
    id: "unmatched-1",
    page: 8,
    text: "The mitochondria produces energy for the cell...",
    confidence: 0.34,
    regions: [
      {
        page: 8,
        x: 11,
        y: 72,
        width: 76,
        height: 14,
      },
    ],
  },
];