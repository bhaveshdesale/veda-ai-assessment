import { NextResponse } from "next/server";

import {
  extractAnswers,
} from "@/lib/ai/extract-answers";

import {
  extractQuestions,
} from "@/lib/ai/extract-questions";

import {
  mapAnswers,
} from "@/lib/mapping/map-answers";

export const runtime = "nodejs";

export async function POST(
  request: Request,
) {
  try {
    console.log(
      "ASSESSMENT PROCESSING ROUTE HIT",
    );

    const formData =
      await request.formData();

    const questionPaper =
      formData.get(
        "questionPaper",
      );

    const answerSheet =
      formData.get(
        "answerSheet",
      );

    if (
      !(questionPaper instanceof File)
    ) {
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

    if (
      !(answerSheet instanceof File)
    ) {
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
      "Question paper:",
      {
        name: questionPaper.name,
        type: questionPaper.type,
        size: questionPaper.size,
      },
    );

    console.log(
      "Answer sheet:",
      {
        name: answerSheet.name,
        type: answerSheet.type,
        size: answerSheet.size,
      },
    );

    /*
     * STEP 1
     *
     * Extract questions.
     */
    console.log(
      "Extracting questions...",
    );

    const questionResult =
      await extractQuestions(
        questionPaper,
      );

    console.log(
      `Extracted ${questionResult.questions.length} questions.`,
    );

    /*
     * STEP 2
     *
     * Extract student answers.
     */
    console.log(
      "Extracting answers...",
    );

    const answerResult =
      await extractAnswers(
        answerSheet,
      );

    console.log(
      `Extracted ${answerResult.answers.length} answers.`,
    );

    /*
     * STEP 3
     *
     * Map answers to questions.
     */
    console.log(
      "Mapping answers...",
    );

    const mappings =
      mapAnswers(
        questionResult.questions,
        answerResult.answers,
      );

    console.log(
      `Created ${mappings.length} mappings.`,
    );

    /*
     * STEP 4
     *
     * Return the complete assessment
     * processing result.
     */
    return NextResponse.json({
      success: true,

      data: {
        questions:
          questionResult.questions,

        answers:
          answerResult.answers,

        mappings,
      },
    });
  } catch (error) {
    console.error(
      "ASSESSMENT PROCESSING FAILED:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to process assessment.",
      },
      {
        status: 500,
      },
    );
  }
}