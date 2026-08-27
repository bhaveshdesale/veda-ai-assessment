import fs from "node:fs/promises";

const filePath = process.argv[2];

if (!filePath) {
  console.error(
    "Usage: node scripts/test-answer-extraction.mjs <file>",
  );

  process.exit(1);
}

const fileBuffer =
  await fs.readFile(filePath);

const fileName =
  filePath.split("\\").pop() ??
  filePath.split("/").pop();

const formData =
  new FormData();

const blob = new Blob(
  [fileBuffer],
  {
    type: "application/pdf",
  },
);

formData.append(
  "file",
  blob,
  fileName,
);

console.log(
  "Sending answer sheet to AI...",
);

const response =
  await fetch(
    "http://localhost:3000/api/extract/answers",
    {
      method: "POST",
      body: formData,
    },
  );

const text =
  await response.text();

console.log(
  "\nAI RESPONSE:\n",
);

console.log(text);