import "server-only";
import { createCanvas } from "@napi-rs/canvas";
import {
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist/legacy/build/pdf.mjs";

import type {
  DocumentPage,
  SupportedFileType,
} from "@/types/document";

type RenderDocumentPagesInput = {
  documentId: string;
  file: File;
  fileType: SupportedFileType;
};

export async function renderDocumentPages({
  documentId,
  file,
  fileType,
}: RenderDocumentPagesInput): Promise<DocumentPage[]> {
  if (fileType === "application/pdf") {
    return renderPdfPages(documentId, file);
  }

  return renderImagePage(documentId, file);
}

async function renderPdfPages(
  documentId: string,
  file: File,
): Promise<DocumentPage[]> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;

  return renderPdfDocument(
    documentId,
    pdf,
  );
}

async function renderPdfDocument(
  documentId: string,
  pdf: PDFDocumentProxy,
): Promise<DocumentPage[]> {
  const pages: DocumentPage[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page =
      await pdf.getPage(pageNumber);

    const viewport =
      page.getViewport({
        scale: 1.5,
      });

    const width = Math.ceil(
      viewport.width,
    );

    const height = Math.ceil(
      viewport.height,
    );

    const canvas = createCanvas(
      width,
      height,
    );

    const context =
      canvas.getContext("2d");

    /*
     * pdfjs-dist expects a browser
     * HTMLCanvasElement / CanvasRenderingContext2D.
     *
     * @napi-rs/canvas provides the equivalent
     * Node.js canvas implementation.
     *
     * We keep the cast at this integration
     * boundary instead of spreading `any`
     * throughout the application.
     */
    await page.render({
      canvas:
        canvas as unknown as HTMLCanvasElement,
      canvasContext:
        context as unknown as CanvasRenderingContext2D,
      viewport,
    }).promise;

    const pngBuffer =
      canvas.toBuffer("image/png");

    pages.push({
      documentId,
      pageNumber,
      width,
      height,
      imageUrl:
        `data:image/png;base64,${pngBuffer.toString(
          "base64",
        )}`,
    });

    page.cleanup();
  }

  return pages;
}

async function renderImagePage(
  documentId: string,
  file: File,
): Promise<DocumentPage[]> {
  const arrayBuffer =
    await file.arrayBuffer();

  const buffer = Buffer.from(
    arrayBuffer,
  );

  const canvasModule =
    await import("@napi-rs/canvas");

  const dimensions =
    await getImageDimensions(
      buffer,
      canvasModule,
    );

  return [
    {
      documentId,
      pageNumber: 1,
      width: dimensions.width,
      height: dimensions.height,
      imageUrl:
        `data:${file.type};base64,${buffer.toString(
          "base64",
        )}`,
    },
  ];
}

async function getImageDimensions(
  buffer: Buffer,
  canvasModule: typeof import("@napi-rs/canvas"),
) {
  const image =
    await canvasModule.loadImage(buffer);

  return {
    width: image.width,
    height: image.height,
  };
}