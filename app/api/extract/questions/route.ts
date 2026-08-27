import { NextResponse } from "next/server";

import { extractQuestions } from "@/lib/ai/extract-questions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  console.log("QUESTION EXTRACTION ROUTE HIT");

  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Question paper is required.",
        },
        {
          status: 400,
        },
      );
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    console.log("Calling Gemini...");

    const result = await extractQuestions(file);

    console.log("Gemini extraction successful.");

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "QUESTION EXTRACTION FAILED:",
      error,
    );

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract questions.",
      },
      {
        status: 500,
      },
    );
  }
}