<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->

# 🧠 VedaAI — AI Assessment Review

An AI-powered assessment evaluation application that helps teachers extract questions, map student answers, and review handwritten answer sheets with exact answer highlighting.

## 🎥 Demo

**Video:** YOUR_VIDEO_LINK_HERE

The demo covers the complete flow:

`Upload → AI Processing → Question Extraction → Answer Extraction → Mapping → Grading → Review`

---

## ✨ Features

- Upload question paper and student answer sheet
- Supports PDF, JPG and PNG
- Extracts questions in the original order
- Supports question sub-parts such as `11(a)` and `11(b)`
- Extracts handwritten and printed answers
- Handles answers written out of order
- Detects unanswered questions
- Handles unmatched answers
- Maps answers to the correct questions
- Highlights the exact answer region on the original answer sheet
- Supports answers spanning multiple pages
- AI-based scoring and feedback
- Responsive desktop and mobile interface

---

## 🏗️ Architecture

```
             Teacher
                │
                ▼
        ┌─────────────────┐
        │   Upload Files  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Next.js API    │
        └────────┬────────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
 Question Extraction   Answer Extraction
       │                   │
       └─────────┬─────────┘
                 ▼
          Answer Mapping
                 │
                 ▼
            AI Grading
                 │
                 ▼
         Assessment Review
                 │
        ┌────────┴────────┐
        ▼                 ▼
 Question Details    Original PDF
                     + Highlight
```

**Processing Pipeline**

```
Question Paper
      ↓
Gemini Question Extraction
      ↓
Student Answer Sheet
      ↓
Gemini Answer Extraction
      ↓
Answer Mapping
      ↓
Gemini Grading
      ↓
Teacher Review
```

---

## 🎯 Key Implementation

### Original Document Preservation

The application keeps the original answer-sheet PDF/image intact.

Instead of recreating the document from extracted text, the original document is rendered and the AI-generated answer regions are placed on top of it.

```
Original Answer Sheet
        +
AI Answer Region
        ↓
Highlighted Answer
```

This preserves the student's original handwriting and document layout.

### Answer Mapping

Each extracted answer contains:

- Question number
- Answer text
- Page
- Bounding regions
- Confidence

Answers can therefore be mapped even when students answer questions out of order.

### Exact Highlighting

Answer regions use normalized page coordinates:

- x
- y
- width
- height
- page

This allows the highlight to remain aligned when the document is resized across desktop and mobile screens.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Next.js | Application & API |
| React | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Google Gemini | Extraction & grading |
| Zod | AI response validation |
| PDF.js | PDF rendering |
| Lucide React | UI icons |

---

## 📂 Project Structure

```
app/
├── api/
│   ├── process-assessment/
│   └── documents/pages/
└── page.tsx

components/
└── exams/
    ├── upload/
    ├── processing/
    └── review/

lib/
├── ai/
│   ├── extract-questions.ts
│   ├── extract-answers.ts
│   ├── grade-answers.ts
│   ├── prompts/
│   └── schemas/
└── documents/

types/
├── assessment.ts
├── document.ts
├── extraction.ts
├── mapping.ts
├── grading.ts
└── processing.ts
```

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd veda-ai-assessment
```

### 2. Install

```bash
npm install
```

### 3. Environment Variables

Create `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key
```

`.env.example` is included in the repository:

```
GEMINI_API_KEY=
```

The real API key should never be committed.

### 4. Run

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔍 Validation

Before deployment:

```bash
npm run lint
npm run build
```

---

## 🚀 Deployment

The application can be deployed using Vercel or any Next.js-compatible hosting platform.

Configure the following environment variable in production:

```
GEMINI_API_KEY
```

---

## 📌 Important Assumptions

- One student answer sheet is processed at a time.
- AI extraction may require teacher review for low-confidence mappings.
- Answer regions are generated as approximate normalized bounding boxes.
- No authentication or database is required for this assignment.

---

## 👨‍💻 Author

**Bhavesh Desale**

GitHub: [https://github.com/bhaveshdesale](https://github.com/bhaveshdesale)