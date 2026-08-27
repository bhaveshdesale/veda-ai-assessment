import fs from "fs";

const filePath = process.argv[2];

if (!filePath) {
  console.error(
    "Usage: node scripts/test-question-extraction.mjs <pdf-path>",
  );
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(filePath);

const file = new File(
  [fileBuffer],
  "question-paper.pdf",
  {
    type: "application/pdf",
  },
);

const formData = new FormData();

formData.append("file", file);

console.log("Sending question paper to AI...");

const response = await fetch(
  "http://localhost:3000/api/extract/questions",
  {
    method: "POST",
    body: formData,
  },
);

const data = await response.json();

console.log("\nAI RESPONSE:\n");

console.log(
  JSON.stringify(data, null, 2),
);

if (!response.ok) {
  process.exit(1);
}