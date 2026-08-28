"use client";

import { ChevronDown, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import * as pdfjsLib from "pdfjs-dist";

import type {
  AnswerRegion,
  AssessmentQuestion,
  UnmatchedAnswer,
} from "@/types/assessment";

import { ViewerControls } from "./viewer-controls";

/*
 * ============================================================
 * PDF.JS WORKER
 * ============================================================
 *
 * The ORIGINAL uploaded PDF is rendered directly in the browser.
 *
 * We do not convert the answer sheet into PNG.
 * We do not send the answer sheet through Gemini again.
 *
 * Gemini is only responsible for:
 *
 *   PDF
 *    ↓
 *   answer extraction
 *    ↓
 *   question mapping
 *    ↓
 *   coordinates
 *
 * PDF.js is responsible for:
 *
 *   ORIGINAL PDF
 *    ↓
 *   visual rendering
 *
 * The AI regions are then drawn over the original PDF.
 */

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
}

/*
 * ============================================================
 * PROPS
 * ============================================================
 */

type AnswerSheetViewerProps = {
  question: AssessmentQuestion;

  unmatchedAnswer?: UnmatchedAnswer | null;

  answerSheetFile: File | null;
};

/*
 * ============================================================
 * MAIN VIEWER
 * ============================================================
 */

export function AnswerSheetViewer({
  question,
  unmatchedAnswer,
  answerSheetFile,
}: AnswerSheetViewerProps) {
  /*
   * Get the AI regions belonging to the
   * selected question.
   *
   * Normal question:
   *
   * question.answerMatch.regions
   *
   * Unmatched answer:
   *
   * unmatchedAnswer.regions
   */

  const regions = useMemo<AnswerRegion[]>(() => {
    if (unmatchedAnswer) {
      return unmatchedAnswer.regions;
    }

    return question.answerMatch?.regions ?? [];
  }, [question.answerMatch?.regions, unmatchedAnswer]);

  /*
   * Recreate ViewerContent whenever the
   * selected question changes.
   *
   * This allows currentPage to initialize
   * from the first AI region without
   * calling setState() inside an effect.
   */

  return (
    <ViewerContent
      key={`${question.id}-${unmatchedAnswer?.id ?? "question"}`}
      regions={regions}
      unmatchedAnswer={unmatchedAnswer}
      answerSheetFile={answerSheetFile}
    />
  );
}

/*
 * ============================================================
 * VIEWER CONTENT
 * ============================================================
 */

function ViewerContent({
  regions,
  unmatchedAnswer,
  answerSheetFile,
}: {
  regions: AnswerRegion[];

  unmatchedAnswer?: UnmatchedAnswer | null;

  answerSheetFile: File | null;
}) {
  /*
   * ==========================================================
   * REFS
   * ==========================================================
   */

  const viewerRef = useRef<HTMLDivElement>(null);

  const pageContainerRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  const loadingTaskRef = useRef<ReturnType<typeof pdfjsLib.getDocument> | null>(
    null,
  );

  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  /*
   * ==========================================================
   * STATE
   * ==========================================================
   */

  /*
   * The selected question's first region
   * determines the initial page.
   */

  const [currentPage, setCurrentPage] = useState(regions[0]?.page ?? 1);

  const [totalPages, setTotalPages] = useState(0);

  const [zoom, setZoom] = useState(100);

  const [loading, setLoading] = useState(Boolean(answerSheetFile));

  const [error, setError] = useState<string | null>(null);

  /*
   * ==========================================================
   * RELEVANT PAGES
   * ==========================================================
   */

  const pagesWithAnswers = useMemo(() => {
    return Array.from(new Set(regions.map((region) => region.page))).sort(
      (a, b) => a - b,
    );
  }, [regions]);

  const firstRelevantPage = pagesWithAnswers[0] ?? 1;

  /*
   * ==========================================================
   * LOAD ORIGINAL ANSWER SHEET
   * ==========================================================
   */

  useEffect(() => {
    if (!answerSheetFile) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        /*
         * Cancel any previous render.
         */

        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // Ignore cancellation.
          }

          renderTaskRef.current = null;
        }

        /*
         * Destroy previous loading task.
         */

        if (loadingTaskRef.current) {
          try {
            await loadingTaskRef.current.destroy();
          } catch {
            // Ignore cleanup errors.
          }

          loadingTaskRef.current = null;
        }

        /*
         * Clean previous PDF.
         *
         * Do NOT call pdf.destroy().
         *
         * Your installed PDFDocumentProxy
         * exposes cleanup().
         */

        if (pdfRef.current) {
          try {
            await pdfRef.current.cleanup();
          } catch {
            // Ignore cleanup errors.
          }

          pdfRef.current = null;
        }

        /*
         * Read the ORIGINAL uploaded PDF.
         */

        const file = answerSheetFile;

        if (!file) {
          return;
        }

        const arrayBuffer = await file.arrayBuffer();

        if (cancelled) {
          return;
        }

        /*
         * Load PDF directly with PDF.js.
         */

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });

        loadingTaskRef.current = loadingTask;

        const pdf = await loadingTask.promise;

        if (cancelled) {
          try {
            await pdf.cleanup();
          } catch {
            // Ignore cleanup errors.
          }

          return;
        }

        /*
         * Store loaded PDF.
         */

        pdfRef.current = pdf;

        setTotalPages(pdf.numPages);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("ANSWER SHEET PDF LOAD FAILED:", err);

        setError(
          err instanceof Error ? err.message : "Failed to load answer sheet.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPdf();

    /*
     * Cleanup.
     */

    return () => {
      cancelled = true;

      /*
       * Cancel rendering.
       */

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation.
        }

        renderTaskRef.current = null;
      }

      /*
       * Destroy loading task.
       */

      if (loadingTaskRef.current) {
        void loadingTaskRef.current.destroy().catch(() => {
          // Ignore cleanup errors.
        });

        loadingTaskRef.current = null;
      }

      /*
       * Cleanup PDF.
       */

      if (pdfRef.current) {
        try {
          void pdfRef.current.cleanup();
        } catch {
          // Ignore cleanup errors.
        }

        pdfRef.current = null;
      }
    };
  }, [answerSheetFile]);

  /*
   * ==========================================================
   * RENDER PDF PAGE
   * ==========================================================
   */

  const renderPage = useCallback(async () => {
    const pdf = pdfRef.current;

    const canvas = canvasRef.current;

    if (!pdf || !canvas || currentPage < 1 || currentPage > pdf.numPages) {
      return;
    }

    try {
      /*
       * Cancel previous render.
       */

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation.
        }

        renderTaskRef.current = null;
      }

      /*
       * Get requested PDF page.
       */

      const page = await pdf.getPage(currentPage);

      /*
       * Make sure the page is still
       * the selected page.
       */

      if (currentPage < 1 || currentPage > pdf.numPages) {
        page.cleanup();
        return;
      }

      /*
       * ======================================================
       * VIEWPORT
       * ======================================================
       *
       * IMPORTANT:
       *
       * Do NOT call context.setTransform()
       * manually.
       *
       * PDF.js will receive the outputScale
       * through `transform`.
       */

      const scale = zoom / 100;

      const viewport = page.getViewport({
        scale,
      });

      /*
       * ======================================================
       * DEVICE PIXEL RATIO
       * ======================================================
       */

      const pixelRatio =
        typeof window !== "undefined"
          ? Math.max(1, window.devicePixelRatio || 1)
          : 1;

      /*
       * ======================================================
       * CANVAS DIMENSIONS
       * ======================================================
       */

      const canvasWidth = Math.floor(viewport.width * pixelRatio);

      const canvasHeight = Math.floor(viewport.height * pixelRatio);

      /*
       * Internal canvas resolution.
       *
       * This keeps the PDF sharp.
       */

      canvas.width = canvasWidth;

      canvas.height = canvasHeight;

      /*
       * CSS dimensions represent the
       * actual visual PDF size.
       */

      canvas.style.width = `${viewport.width}px`;

      canvas.style.height = `${viewport.height}px`;

      /*
       * ======================================================
       * CONTAINER DIMENSIONS
       * ======================================================
       *
       * Explicitly size the page container
       * to exactly the same dimensions as
       * the PDF canvas.
       *
       * This is important because the AI
       * percentage coordinates are positioned
       * against this container.
       */

      if (pageContainerRef.current) {
        pageContainerRef.current.style.width = `${viewport.width}px`;

        pageContainerRef.current.style.height = `${viewport.height}px`;
      }

      /*
       * ======================================================
       * CONTEXT
       * ======================================================
       */

      const context = canvas.getContext("2d");

      if (!context) {
        page.cleanup();
        return;
      }

      /*
       * Reset any previous transform.
       *
       * We intentionally do NOT use
       * context.setTransform(pixelRatio...)
       * here.
       */

      context.setTransform(1, 0, 0, 1, 0, 0);

      /*
       * Clear previous page.
       */

      context.clearRect(0, 0, canvas.width, canvas.height);

      /*
       * ======================================================
       * PDF.JS RENDER
       * ======================================================
       *
       * The important part:
       *
       *   canvas
       *   canvasContext
       *   viewport
       *   transform
       *
       * PDF.js renders the ORIGINAL PDF.
       */

      const renderTask = page.render({
        canvas,
        canvasContext: context,
        viewport,

        /*
         * Apply device pixel ratio
         * through PDF.js instead of
         * manually transforming context.
         */

        transform:
          pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined,
      });

      renderTaskRef.current = renderTask;

      await renderTask.promise;

      /*
       * Only clear the task if this is
       * still the active render.
       */

      if (renderTaskRef.current === renderTask) {
        renderTaskRef.current = null;
      }

      /*
       * Release page resources.
       */

      page.cleanup();
    } catch (err) {
      /*
       * Page rendering is cancelled when
       * user switches questions/pages.
       *
       * That is expected.
       */

      if (err instanceof Error && err.name === "RenderingCancelledException") {
        return;
      }

      console.error("ANSWER SHEET PAGE RENDER FAILED:", err);

      setError(
        err instanceof Error ? err.message : "Failed to render answer sheet.",
      );
    }
  }, [currentPage, zoom]);

  /*
   * Render whenever page or zoom changes.
   */

  useEffect(() => {
    if (!pdfRef.current) {
      return;
    }

    void renderPage();
  }, [renderPage, totalPages]);

  /*
   * ==========================================================
   * SCROLL TO SELECTED ANSWER
   * ==========================================================
   */

  useEffect(() => {
    if (
      !viewerRef.current ||
      !pageContainerRef.current ||
      regions.length === 0
    ) {
      return;
    }

    /*
     * Find a region on the currently
     * displayed page.
     */

    const firstRegion = regions.find((region) => region.page === currentPage);

    if (!firstRegion) {
      return;
    }

    const viewer = viewerRef.current;

    const page = pageContainerRef.current;

    /*
     * Wait until the PDF canvas has
     * been laid out by the browser.
     */

    const frame = window.requestAnimationFrame(() => {
      const pageHeight = page.clientHeight;

      if (pageHeight <= 0) {
        return;
      }

      /*
       * AI coordinates are percentages
       * of the original page.
       */

      const regionTop = (firstRegion.y / 100) * pageHeight;

      const regionHeight = (firstRegion.height / 100) * pageHeight;

      /*
       * Center the answer region.
       */

      const targetTop = regionTop + regionHeight / 2 - viewer.clientHeight / 2;

      viewer.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentPage, regions, zoom]);

  /*
   * ==========================================================
   * PAGE CONTROLS
   * ==========================================================
   */

  function previousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function nextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  /*
   * ==========================================================
   * ZOOM CONTROLS
   * ==========================================================
   */

  function zoomIn() {
    setZoom((value) => Math.min(160, value + 10));
  }

  function zoomOut() {
    setZoom((value) => Math.max(70, value - 10));
  }

  function resetZoom() {
    setZoom(100);
  }

  /*
   * ==========================================================
   * JUMP TO ANSWER
   * ==========================================================
   */

  function jumpToAnswer() {
    if (pagesWithAnswers.length === 0) {
      return;
    }

    setCurrentPage(firstRelevantPage);
  }

  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <section className="flex min-h-0 flex-col overflow-hidden bg-[#e8e4db]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex h-10 shrink-0 items-center justify-between bg-[#343530] px-4 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[8px] font-medium">
            Student Answer Sheet
          </span>

          {regions.length > 0 && (
            <span className="hidden rounded-full bg-[#4c4d46] px-2 py-0.5 text-[7px] text-[#d7d5cf] sm:inline">
              {regions.length} highlighted{" "}
              {regions.length === 1 ? "region" : "regions"}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Fullscreen viewer"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#d7d5cf] hover:bg-[#4a4b44]"
        >
          <Maximize2 size={12} />
        </button>
      </div>

      {/* =====================================================
          MULTI PAGE ANSWER
          ===================================================== */}

      {pagesWithAnswers.length > 1 && (
        <div className="flex items-center justify-between bg-[#3d3e38] px-4 py-1.5">
          <span className="text-[7px] text-[#bbb9b2]">
            Answer spans multiple pages
          </span>

          <button
            type="button"
            onClick={jumpToAnswer}
            className="flex items-center gap-1 text-[7px] font-semibold text-[#f0b29e]"
          >
            Jump to answer
            <ChevronDown size={9} />
          </button>
        </div>
      )}

      {/* =====================================================
          PDF VIEWER
          ===================================================== */}

      <div ref={viewerRef} className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        {/* ===================================================
            LOADING
            =================================================== */}

        {loading ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <p className="text-[9px] text-[#77746c]">Loading answer sheet...</p>
          </div>
        ) : error ? (
          /* =================================================
             ERROR
             ================================================= */
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <p className="max-w-[300px] text-center text-[9px] text-[#b56750]">
              {error}
            </p>
          </div>
        ) : !answerSheetFile ? (
          /* =================================================
             NO FILE
             ================================================= */
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <p className="text-[9px] text-[#77746c]">
              Answer sheet is not available.
            </p>
          </div>
        ) : (
          /* =================================================
             ORIGINAL PDF
             ================================================= */
          <div className="flex min-h-full min-w-full items-start justify-center">
            <div
              ref={pageContainerRef}
              className="relative shrink-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.16)]"
            >
              {/* =================================================
                  ORIGINAL PDF CANVAS
                  ================================================= */}

              <canvas ref={canvasRef} className="block select-none" />

              {/* =================================================
                  AI MAPPED REGIONS
                  ================================================= */}

              {regions
                .filter((region) => region.page === currentPage)
                .map((region, index) => (
                  <AnswerRegionOverlay
                    key={`${region.page}-${region.x}-${region.y}-${region.width}-${region.height}-${index}`}
                    region={region}
                    label={
                      unmatchedAnswer ? "Unmatched" : `Answer ${index + 1}`
                    }
                    variant={unmatchedAnswer ? "unmatched" : "matched"}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          VIEWER CONTROLS
          ===================================================== */}

      <ViewerControls
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />
    </section>
  );
}

/*
 * ============================================================
 * ANSWER REGION OVERLAY
 * ============================================================
 *
 * Gemini gives coordinates as percentages:
 *
 * x
 * y
 * width
 * height
 *
 * Example:
 *
 * x      = 10
 * y      = 50
 * width  = 80
 * height = 15
 *
 * Therefore:
 *
 * left   = 10%
 * top    = 50%
 * width  = 80%
 * height = 15%
 *
 * The overlay is positioned relative to
 * the ORIGINAL PDF page container.
 */

function AnswerRegionOverlay({
  region,
  label,
  variant,
}: {
  region: AnswerRegion;

  label: string;

  variant: "matched" | "unmatched";
}) {
  const isUnmatched = variant === "unmatched";

  return (
    <div
      className={[
        "pointer-events-none absolute rounded-[5px]",
        "border-2",
        isUnmatched
          ? "border-[#d87554] bg-[#eaa789]/25"
          : "border-[#75a663] bg-[#a9d294]/25",
      ].join(" ")}
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
      }}
    >
      <span
        className={[
          "absolute -left-[2px] -top-[18px]",
          "rounded-[4px] px-1.5 py-0.5 text-[6px]",
          "font-semibold text-white",
          isUnmatched ? "bg-[#d87554]" : "bg-[#75a663]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
