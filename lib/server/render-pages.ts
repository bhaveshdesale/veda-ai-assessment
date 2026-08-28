import "server-only";

import path from "node:path";
import { pathToFileURL } from "node:url";

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
    return renderPdfPages(
      documentId,
      file,
    );
  }

  return renderImagePage(
    documentId,
    file,
  );
}

/*
 * Render PDF pages
 */
async function renderPdfPages(
  documentId: string,
  file: File,
): Promise<DocumentPage[]> {
  const arrayBuffer =
    await file.arrayBuffer();

  const standardFontPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "standard_fonts",
  );

  /*
   * pdfjs-dist expects a URL here.
   *
   * Windows paths such as:
   *
   * C:\Users\...\standard_fonts\
   *
   * are not valid factory URLs.
   *
   * Convert the filesystem path into:
   *
   * file:///C:/Users/.../standard_fonts/
   */
  const standardFontDataUrl =
    pathToFileURL(
      standardFontPath +
        path.sep,
    ).href;

  const pdf =
    await getDocument({
      data: new Uint8Array(
        arrayBuffer,
      ),

      standardFontDataUrl,
    }).promise;

  try {
    return await renderPdfDocument(
      documentId,
      pdf,
    );
  } finally {
    /*
     * cleanup() is supported by the
     * PDFDocumentProxy version we are using.
     *
     * Do NOT call pdf.destroy().
     */
    await pdf.cleanup();
  }
}

/*
 * Render every PDF page into PNG.
 */
async function renderPdfDocument(
  documentId: string,
  pdf: PDFDocumentProxy,
): Promise<DocumentPage[]> {
  const pages: DocumentPage[] = [];

  /*
   * Render at higher resolution so the
   * handwritten answer sheet remains readable
   * when zoomed in inside the review UI.
   */
  const RENDER_SCALE = 2.5;

  try {
    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page =
        await pdf.getPage(
          pageNumber,
        );

      try {
        const viewport =
          page.getViewport({
            scale: RENDER_SCALE,
          });

        const width =
          Math.ceil(
            viewport.width,
          );

        const height =
          Math.ceil(
            viewport.height,
          );

        const canvas =
          createCanvas(
            width,
            height,
          );

        const context =
          canvas.getContext("2d");

        /*
         * White background is important
         * for scanned answer sheets.
         */
        context.fillStyle =
          "#ffffff";

        context.fillRect(
          0,
          0,
          width,
          height,
        );

        await page.render({
          canvas:
            canvas as unknown as HTMLCanvasElement,
          canvasContext:
            context as unknown as CanvasRenderingContext2D,
          viewport,
        }).promise;

        const pngBuffer =
          canvas.toBuffer(
            "image/png",
          );

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
      } finally {
        page.cleanup();
      }
    }

    return pages;
  } finally {
    /*
     * PDFDocumentProxy in the version you are
     * using does not expose destroy() in TypeScript.
     *
     * cleanup() is the supported operation here.
     */
    await pdf.cleanup();
  }
}

/*
 * Render uploaded JPG/PNG directly.
 */
async function renderImagePage(
  documentId: string,
  file: File,
): Promise<DocumentPage[]> {
  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(
      arrayBuffer,
    );

  const canvasModule =
    await import(
      "@napi-rs/canvas"
    );

  const dimensions =
    await getImageDimensions(
      buffer,
      canvasModule,
    );

  return [
    {
      documentId,

      pageNumber: 1,

      width:
        dimensions.width,

      height:
        dimensions.height,

      imageUrl:
        `data:${file.type};base64,${buffer.toString(
          "base64",
        )}`,
    },
  ];
}

/*
 * Get image dimensions.
 */
async function getImageDimensions(
  buffer: Buffer,
  canvasModule: typeof import("@napi-rs/canvas"),
) {
  const image =
    await canvasModule.loadImage(
      buffer,
    );

  return {
    width: image.width,
    height: image.height,
  };
}