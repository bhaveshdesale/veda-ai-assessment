import type { AssessmentQuestion } from "@/types/assessment";

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
    answerRegions: [
      {
        page: 1,
        x: 12,
        y: 35,
        width: 75,
        height: 14,
      },
    ],
  },
  {
    id: "q2",
    number: "2",
    text: "Which blood vessel carries blood away from the heart?",
    marks: 2,
    score: 2,
    status: "answered",
    answer:
      "Arteries carry blood away from the heart.",
    answerRegions: [
      {
        page: 1,
        x: 10,
        y: 55,
        width: 72,
        height: 10,
      },
    ],
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
    answerRegions: [
      {
        page: 2,
        x: 10,
        y: 20,
        width: 78,
        height: 25,
      },
      {
        page: 2,
        x: 10,
        y: 48,
        width: 76,
        height: 18,
      },
    ],
  },
  {
    id: "q4",
    number: "4",
    text: "Describe the role of chloroplasts in plant cells.",
    marks: 2,
    score: 0,
    status: "unanswered",
    answer: null,
    answerRegions: [],
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
    answerRegions: [
      {
        page: 3,
        x: 11,
        y: 22,
        width: 75,
        height: 27,
      },
    ],
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
    answerRegions: [
      {
        page: 3,
        x: 10,
        y: 58,
        width: 78,
        height: 15,
      },
    ],
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
    answerRegions: [
      {
        page: 5,
        x: 12,
        y: 25,
        width: 76,
        height: 13,
      },
    ],
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
    answerRegions: [
      {
        page: 5,
        x: 11,
        y: 48,
        width: 78,
        height: 22,
      },
    ],
  },
];