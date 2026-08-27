import { NextResponse } from "next/server";

import { renderDocumentPages } from "@/lib/server/render-pages";

export const runtime = "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const documentId =
      formData.get("documentId");

    const fileType =
      formData.get("fileType");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "File is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof documentId !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Document ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      fileType !==
        "application/pdf" &&
      fileType !== "image/jpeg" &&
      fileType !== "image/png"
    ) {
      return NextResponse.json(
        {
          error: "Unsupported file type.",
        },
        {
          status: 400,
        },
      );
    }

    const documentPages =
      await renderDocumentPages({
        documentId,
        file,
        fileType,
      });

    return NextResponse.json({
      documentPages,
    });
  } catch (error) {
    console.error(
      "DOCUMENT PAGE RENDERING FAILED:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to render document.",
      },
      {
        status: 500,
      },
    );
  }
}