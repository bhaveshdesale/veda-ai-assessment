import { NextResponse } from "next/server";

import { extractQuestions } from "@/lib/ai/extract-questions";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Question paper is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Question paper must be a PDF.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await extractQuestions(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Question extraction failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to extract questions.",
      },
      {
        status: 500,
      },
    );
  }
}