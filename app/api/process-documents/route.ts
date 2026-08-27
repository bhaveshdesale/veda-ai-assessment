import { NextResponse } from "next/server";

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

    if (
      !(questionPaper instanceof File) ||
      !(answerSheet instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "Question paper and answer sheet are required.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Documents received successfully.",
    });
  } catch (error) {
    console.error(
      "Document processing error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to process documents.",
      },
      {
        status: 500,
      },
    );
  }
}