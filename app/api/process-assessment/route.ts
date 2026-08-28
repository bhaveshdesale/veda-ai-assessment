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

    if (!(questionPaper instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Question paper is required.",
        },
        { status: 400 },
      );
    }

    if (!(answerSheet instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Answer sheet is required.",
        },
        { status: 400 },
      );
    }

    console.log(
      "Starting assessment processing...",
    );

    /*
     * 1. Extract questions
     */
    console.log(
      "Extracting questions...",
    );

    const questionResult =
      await extractQuestions(
        questionPaper,
      );

    /*
     * 2. Extract student answers
     */
    console.log(
      "Extracting answers...",
    );

    const answerResult =
      await extractAnswers(
        answerSheet,
      );

    /*
     * 3. Match answers to questions
     *
     * For now we use the question number
     * returned by Gemini.
     *
     * The dedicated mapping algorithm can
     * replace this later.
     */
    const answerByQuestion =
      new Map<string, ExtractedAnswer>();

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
     * 4. Prepare questions for grading
     */
    const questionsToGrade =
      questionResult.questions.map(
        (question) => {
          const answer =
            answerByQuestion.get(
              question.number,
            );

          return {
            questionId: question.id,
            question: question.text,
            answer:
              answer?.text ?? null,
            maxMarks:
              question.marks ?? 0,
          };
        },
      );

    /*
     * 5. Grade answers with Gemini
     */
    console.log(
      "Grading student answers...",
    );

    const gradingResult =
      await gradeAnswers(
        questionsToGrade,
      );

    /*
     * 6. Create mappings
     *
     * This is the initial question-number
     * mapping. We will replace this with
     * the full mapping system later.
     */
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
            questionId: question.id,

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

            status: answer
              ? "mapped"
              : "unanswered",
          };
        },
      );

    /*
     * 7. Return complete assessment
     */
    console.log(
      "Assessment processing completed.",
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
      { status: 500 },
    );
  }
}