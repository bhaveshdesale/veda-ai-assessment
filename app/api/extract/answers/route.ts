import { NextResponse } from "next/server";

import { extractAnswers } from "@/lib/ai/extract-answers";

export async function POST(
  request: Request,
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Answer sheet file is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.type.startsWith("image/")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported answer sheet format.",
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      "ANSWER EXTRACTION ROUTE HIT",
    );

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const result =
      await extractAnswers(file);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "ANSWER EXTRACTION FAILED:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to extract answers.",
      },
      {
        status: 500,
      },
    );
  }
}