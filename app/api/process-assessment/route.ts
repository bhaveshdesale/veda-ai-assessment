// import { NextResponse } from "next/server";

// import { extractQuestions } from "@/lib/ai/extract-questions";
// import { extractAnswers } from "@/lib/ai/extract-answers";
// import { gradeAnswers } from "@/lib/ai/grade-answers";

// import type { ExtractedAnswer } from "@/types/extraction";

// /**
//  * Normalize question numbers so small formatting
//  * differences don't break an otherwise correct mapping.
//  *
//  * Examples:
//  *
//  * "6(a)"   -> "6(a)"
//  * "6 (a)"  -> "6(a)"
//  * "6-a"    -> "6a"
//  *
//  * We intentionally do NOT perform spatial guessing.
//  */
// function normalizeQuestionNumber(
//   value: string | null | undefined,
// ): string | null {
//   if (!value) {
//     return null;
//   }

//   return value
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "")
//     .replace(/-/g, "");
// }

// /**
//  * Maps extracted answers to questions using ONLY
//  * the question number returned by Gemini.
//  *
//  * This preserves the mapping behavior that was
//  * already working correctly.
//  */
// function buildAnswerMap(
//   answers: ExtractedAnswer[],
// ): Map<string, ExtractedAnswer> {
//   const answerByQuestion =
//     new Map<string, ExtractedAnswer>();

//   for (const answer of answers) {
//     const questionNumber =
//       normalizeQuestionNumber(
//         answer.questionNumber,
//       );

//     if (!questionNumber) {
//       continue;
//     }

//     /*
//      * Keep the first answer if Gemini accidentally
//      * returns the same question number more than once.
//      */
//     if (
//       !answerByQuestion.has(
//         questionNumber,
//       )
//     ) {
//       answerByQuestion.set(
//         questionNumber,
//         answer,
//       );
//     }
//   }

//   return answerByQuestion;
// }

// /**
//  * Creates the mapping objects returned to the frontend.
//  *
//  * IMPORTANT:
//  *
//  * We preserve answer.regions exactly as returned by
//  * Gemini. The frontend uses these regions to highlight
//  * the ORIGINAL answer-sheet PDF.
//  */
// function buildMappings(
//   questions: Awaited<
//     ReturnType<typeof extractQuestions>
//   >["questions"],
//   answers: ExtractedAnswer[],
// ) {
//   const answerByQuestion =
//     buildAnswerMap(answers);

//   return questions.map(
//     (question) => {
//       const questionNumber =
//         normalizeQuestionNumber(
//           question.number,
//         );

//       const answer =
//         questionNumber
//           ? answerByQuestion.get(
//               questionNumber,
//             )
//           : undefined;

//       /*
//        * No answer found for this question.
//        */
//       if (!answer) {
//         return {
//           questionId:
//             question.id,

//           answerId: null,

//           confidence: 0,

//           method: "combined" as const,

//           regions: [],

//           status:
//             "unanswered" as const,
//         };
//       }

//       /*
//        * Answer successfully mapped by question number.
//        */
//       return {
//         questionId:
//           question.id,

//         answerId:
//           answer.id,

//         confidence:
//           answer.confidence,

//         method:
//           "question-number" as const,

//         /*
//          * VERY IMPORTANT:
//          *
//          * Do not modify these regions.
//          * They point to the original answer-sheet.
//          */
//         regions:
//           answer.regions,

//         status:
//           answer.confidence >= 0.85
//             ? ("mapped" as const)
//             : ("needs-review" as const),
//       };
//     },
//   );
// }

// export async function POST(
//   request: Request,
// ) {
//   try {
//     const formData =
//       await request.formData();

//     const questionPaper =
//       formData.get(
//         "questionPaper",
//       );

//     const answerSheet =
//       formData.get(
//         "answerSheet",
//       );

//     /*
//      * ------------------------------------------
//      * VALIDATION
//      * ------------------------------------------
//      */

//     if (
//       !(questionPaper instanceof File)
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "Question paper is required.",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     if (
//       !(answerSheet instanceof File)
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "Answer sheet is required.",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     console.log(
//       "Starting assessment processing...",
//     );

//     /*
//      * ------------------------------------------
//      * 1. EXTRACT QUESTIONS
//      * ------------------------------------------
//      */

//     console.log(
//       "Extracting questions...",
//     );

//     const questionResult =
//       await extractQuestions(
//         questionPaper,
//       );

//     console.log(
//       `Extracted ${questionResult.questions.length} questions.`,
//     );

//     /*
//      * ------------------------------------------
//      * 2. EXTRACT ANSWERS
//      * ------------------------------------------
//      *
//      * Gemini receives the ORIGINAL answer sheet.
//      *
//      * We do not:
//      *
//      * - rewrite the PDF
//      * - OCR and rebuild the PDF
//      * - convert handwriting into a new PDF
//      * - modify the original document
//      *
//      * Gemini only returns:
//      *
//      * - answer text
//      * - question number
//      * - page
//      * - bounding regions
//      */

//     console.log(
//       "Extracting answers...",
//     );

//     const answerResult =
//       await extractAnswers(
//         answerSheet,
//       );

//     console.log(
//       `Extracted ${answerResult.answers.length} answers.`,
//     );

//     /*
//      * ------------------------------------------
//      * 3. MAP ANSWERS TO QUESTIONS
//      * ------------------------------------------
//      *
//      * Mapping is strictly based on question number.
//      *
//      * This is intentionally NOT spatial mapping.
//      *
//      * Example:
//      *
//      * answer.questionNumber = "5"
//      *
//      * becomes:
//      *
//      * question.number = "5"
//      *
//      * This keeps your previously working behavior.
//      */

//     console.log(
//       "Mapping answers to questions...",
//     );

//     const mappings =
//       buildMappings(
//         questionResult.questions,
//         answerResult.answers,
//       );

//     /*
//      * Debug mappings.
//      */
//     console.log(
//       "Final answer mappings:",
//     );

//     for (const mapping of mappings) {
//       console.log({
//         questionId:
//           mapping.questionId,

//         answerId:
//           mapping.answerId,

//         method:
//           mapping.method,

//         confidence:
//           mapping.confidence,

//         status:
//           mapping.status,

//         regions:
//           mapping.regions,
//       });
//     }

//     /*
//      * ------------------------------------------
//      * 4. PREPARE ANSWERS FOR GRADING
//      * ------------------------------------------
//      */

//     const questionsToGrade =
//       questionResult.questions.map(
//         (question) => {
//           const mapping =
//             mappings.find(
//               (item) =>
//                 item.questionId ===
//                 question.id,
//             );

//           const answer =
//             mapping?.answerId
//               ? answerResult.answers.find(
//                   (item) =>
//                     item.id ===
//                     mapping.answerId,
//                 )
//               : undefined;

//           return {
//             questionId:
//               question.id,

//             question:
//               question.text,

//             answer:
//               answer?.text ?? null,

//             maxMarks:
//               question.marks ?? 0,
//           };
//         },
//       );

//     /*
//      * ------------------------------------------
//      * 5. GRADE ANSWERS
//      * ------------------------------------------
//      */

//     console.log(
//       "Grading student answers...",
//     );

//     const gradingResult =
//       await gradeAnswers(
//         questionsToGrade,
//       );

//     console.log(
//       "Gemini grading completed.",
//     );

//     /*
//      * ------------------------------------------
//      * 6. RETURN COMPLETE ASSESSMENT
//      * ------------------------------------------
//      */

//     console.log(
//       "Assessment processing completed.",
//     );

//     return NextResponse.json({
//       success: true,

//       data: {
//         questions:
//           questionResult.questions,

//         answers:
//           answerResult.answers,

//         mappings,

//         grading:
//           gradingResult.results,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Assessment processing failed:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,

//         error:
//           error instanceof Error
//             ? error.message
//             : "Assessment processing failed.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }


import { NextResponse } from "next/server";

import { extractQuestions } from "@/lib/ai/extract-questions";
import { extractAnswers } from "@/lib/ai/extract-answers";
import { gradeAnswers } from "@/lib/ai/grade-answers";

import type { ExtractedAnswer } from "@/types/extraction";

export async function POST(
  request: Request,
) {
  try {
    const formData =
      await request.formData();

    const questionPaper =
      formData.get("questionPaper");

    const answerSheet =
      formData.get("answerSheet");

    /*
     * --------------------------------------------------
     * Validate files
     * --------------------------------------------------
     */

    if (!(questionPaper instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Question paper is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!(answerSheet instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Answer sheet is required.",
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      "========================================",
    );

    console.log(
      "Starting assessment processing...",
    );

    console.log(
      `Question paper: ${questionPaper.name}`,
    );

    console.log(
      `Answer sheet: ${answerSheet.name}`,
    );

    console.log(
      "========================================",
    );

    /*
     * --------------------------------------------------
     * 1. Extract questions AND answers in parallel
     * --------------------------------------------------
     *
     * These two operations are independent.
     *
     * Before:
     *
     * question extraction
     *        ↓
     * answer extraction
     *
     * Now:
     *
     * question extraction ──┐
     *                       ├── continue
     * answer extraction ────┘
     */

    console.log(
      "Extracting questions and answers in parallel...",
    );

    const [
      questionResult,
      answerResult,
    ] = await Promise.all([
      extractQuestions(
        questionPaper,
      ),

      extractAnswers(
        answerSheet,
      ),
    ]);

    console.log(
      `Extracted ${questionResult.questions.length} questions.`,
    );

    console.log(
      `Extracted ${answerResult.answers.length} answers.`,
    );

    /*
     * --------------------------------------------------
     * 2. Map answers to questions
     * --------------------------------------------------
     */

    console.log(
      "Mapping answers to questions...",
    );

    const answerByQuestion =
      new Map<
        string,
        ExtractedAnswer
      >();

    for (const answer of answerResult.answers) {
      if (
        answer.questionNumber &&
        !answerByQuestion.has(
          answer.questionNumber,
        )
      ) {
        answerByQuestion.set(
          answer.questionNumber,
          answer,
        );
      }
    }

    /*
     * --------------------------------------------------
     * 3. Prepare questions for grading
     * --------------------------------------------------
     */

    const questionsToGrade =
      questionResult.questions.map(
        (question) => {
          const answer =
            answerByQuestion.get(
              question.number,
            );

          return {
            questionId:
              question.id,

            question:
              question.text,

            answer:
              answer?.text ?? null,

            maxMarks:
              question.marks ?? 0,
          };
        },
      );

    /*
     * --------------------------------------------------
     * 4. Grade answers
     * --------------------------------------------------
     */

    console.log(
      "Grading student answers...",
    );

    const gradingResult =
      await gradeAnswers(
        questionsToGrade,
      );

    /*
     * --------------------------------------------------
     * 5. Create mappings
     * --------------------------------------------------
     */

    console.log(
      "Creating answer mappings...",
    );

    const mappings =
      questionResult.questions.map(
        (question) => {
          const answer =
            answerByQuestion.get(
              question.number,
            );

          const grading =
            gradingResult.results.find(
              (item) =>
                item.questionId ===
                question.id,
            );

          return {
            questionId:
              question.id,

            answerId:
              answer?.id ?? null,

            confidence:
              answer?.confidence ??
              grading?.confidence ??
              0,

            method:
              answer
                ? "question-number"
                : "combined",

            regions:
              answer?.regions ?? [],

            status:
              answer
                ? "mapped"
                : "unanswered",
          };
        },
      );

    /*
     * --------------------------------------------------
     * 6. Return final assessment
     * --------------------------------------------------
     */

    console.log(
      "Assessment processing completed.",
    );

    console.log(
      "========================================",
    );

    return NextResponse.json({
      success: true,

      data: {
        questions:
          questionResult.questions,

        answers:
          answerResult.answers,

        mappings,

        grading:
          gradingResult.results,
      },
    });
  } catch (error) {
    console.error(
      "Assessment processing failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Assessment processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}