const questions = [
  {
    id: "q1",
    number: "1",
  },
  {
    id: "q2",
    number: "2",
  },
  {
    id: "q30a",
    number: "30(a)",
  },
  {
    id: "q30b",
    number: "30(b)",
  },
];

const answers = [
  {
    id: "a1",
    questionNumber: "1",
    regions: [],
  },
  {
    id: "a2",
    questionNumber: "2",
    regions: [],
  },
  {
    id: "a30a",
    questionNumber: "30(a)",
    regions: [],
  },
  {
    id: "a30b",
    questionNumber: "30(b)",
    regions: [],
  },
];

console.log(
  "Question-number mapping test",
);

for (const question of questions) {
  const answer = answers.find(
    (item) =>
      item.questionNumber
        .replace(/\s/g, "")
        .toLowerCase() ===
      question.number
        .replace(/\s/g, "")
        .toLowerCase(),
  );

  console.log(
    `${question.number} -> ${
      answer?.id ?? "UNANSWERED"
    }`,
  );
}