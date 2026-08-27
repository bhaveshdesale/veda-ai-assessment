"use client";

import {
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  AssessmentQuestion,
  AnswerRegion,
  UnmatchedAnswer,
} from "@/types/assessment";
import type { DocumentPage } from "@/types/document";

import { ViewerControls } from "./viewer-controls";

type AnswerSheetViewerProps = {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
  documentPages: DocumentPage[];
};

export function AnswerSheetViewer({
  question,
  unmatchedAnswer,
  documentPages,
}: AnswerSheetViewerProps) {
  /*
   * Decide which answer regions should
   * be displayed.
   */
  const regions = useMemo<AnswerRegion[]>(
    () => {
      if (unmatchedAnswer) {
        return unmatchedAnswer.regions;
      }

      return (
        question.answerMatch?.regions ??
        []
      );
    },
    [
      question.answerMatch?.regions,
      unmatchedAnswer,
    ],
  );

  /*
   * Find every page that contains
   * part of the selected answer.
   */
  const pagesWithAnswers = useMemo(() => {
    return Array.from(
      new Set(
        regions.map(
          (region) => region.page,
        ),
      ),
    ).sort((a, b) => a - b);
  }, [regions]);

  /*
   * Open directly on the first page
   * containing the selected answer.
   */
  const firstRelevantPage =
    pagesWithAnswers[0] ?? 1;

  return (
    <ViewerContent
      key={`${question.id}-${
        unmatchedAnswer?.id ??
        "question"
      }`}
      question={question}
      unmatchedAnswer={
        unmatchedAnswer
      }
      regions={regions}
      pagesWithAnswers={
        pagesWithAnswers
      }
      firstRelevantPage={
        firstRelevantPage
      }
      documentPages={documentPages}
    />
  );
}

function ViewerContent({
  question,
  unmatchedAnswer,
  regions,
  pagesWithAnswers,
  firstRelevantPage,
  documentPages,
}: {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
  regions: AnswerRegion[];
  pagesWithAnswers: number[];
  firstRelevantPage: number;
  documentPages: DocumentPage[];
}) {
  const [currentPage, setCurrentPage] =
    useState(firstRelevantPage);

  const [zoom, setZoom] =
    useState(100);

  /*
   * Only show regions belonging
   * to the current page.
   */
  const currentPageRegions =
    useMemo(
      () =>
        regions.filter(
          (region) =>
            region.page ===
            currentPage,
        ),
      [
        regions,
        currentPage,
      ],
    );

  /*
   * Find the actual rendered page
   * corresponding to currentPage.
   */
  const currentDocumentPage =
    documentPages.find(
      (page) =>
        page.pageNumber ===
        currentPage,
    );

  function previousPage() {
    setCurrentPage((page) =>
      Math.max(1, page - 1),
    );
  }

  function nextPage() {
    setCurrentPage((page) =>
      Math.min(
        documentPages.length,
        page + 1,
      ),
    );
  }

  function zoomIn() {
    setZoom((value) =>
      Math.min(
        150,
        value + 10,
      ),
    );
  }

  function zoomOut() {
    setZoom((value) =>
      Math.max(
        70,
        value - 10,
      ),
    );
  }

  function resetZoom() {
    setZoom(100);
  }

  function jumpToAnswer() {
    setCurrentPage(
      firstRelevantPage,
    );
  }

  return (
    <section className="flex min-h-0 flex-col overflow-hidden bg-[#e8e4db]">
      {/* Viewer header */}
      <div className="flex h-10 shrink-0 items-center justify-between bg-[#343530] px-4 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[8px] font-medium">
            Student Answer Sheet
          </span>

          {regions.length > 0 && (
            <span className="hidden rounded-full bg-[#4c4d46] px-2 py-0.5 text-[7px] text-[#d7d5cf] sm:inline">
              {regions.length}{" "}
              highlighted{" "}
              {regions.length === 1
                ? "region"
                : "regions"}
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

      {/* Multi-page answer notice */}
      {pagesWithAnswers.length >
        1 && (
        <div className="flex items-center justify-between bg-[#3d3e38] px-4 py-1.5">
          <span className="text-[7px] text-[#bbb9b2]">
            Answer spans multiple
            pages
          </span>

          <button
            type="button"
            onClick={
              jumpToAnswer
            }
            className="flex items-center gap-1 text-[7px] font-semibold text-[#f0b29e]"
          >
            Jump to answer
            <ChevronDown size={9} />
          </button>
        </div>
      )}

      {/* Document viewport */}
      <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-8">
        <div className="flex min-h-full min-w-full items-start justify-center">
          <div
            className="relative shrink-0 bg-[#fffdf8] shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-[width,min-height] duration-200"
            style={{
              width:
                `${380 * (zoom / 100)}px`,
              minHeight:
                `${500 * (zoom / 100)}px`,
            }}
          >
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                width:
                  `${100 / (zoom / 100)}%`,
                transform:
                  `scale(${zoom / 100})`,
              }}
            >
              <DocumentPage
                question={question}
                unmatchedAnswer={
                  unmatchedAnswer
                }
                currentPage={
                  currentPage
                }
                totalPages={
                  documentPages.length
                }
                regions={
                  currentPageRegions
                }
                documentPage={
                  currentDocumentPage
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Viewer controls */}
      <ViewerControls
        currentPage={currentPage}
        totalPages={
          documentPages.length
        }
        zoom={zoom}
        onPreviousPage={
          previousPage
        }
        onNextPage={
          nextPage
        }
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={
          resetZoom
        }
      />
    </section>
  );
}

function DocumentPage({
  question,
  unmatchedAnswer,
  currentPage,
  totalPages,
  regions,
  documentPage,
}: {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
  currentPage: number;
  totalPages: number;
  regions: AnswerRegion[];
  documentPage?: DocumentPage;
}) {
  return (
    <div className="relative w-[380px] overflow-hidden bg-[#fffdf8]">
      {/* Real rendered document page */}
      {documentPage ? (
        <img
          src={documentPage.imageUrl}
          alt={`Answer sheet page ${documentPage.pageNumber}`}
          className="block h-auto w-full"
        />
      ) : (
        <div className="flex min-h-[500px] items-center justify-center p-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#77746c]">
              Page not available
            </p>

            <p className="mt-1 text-[8px] text-[#aaa69d]">
              Page {currentPage} of{" "}
              {totalPages}
            </p>
          </div>
        </div>
      )}

      {/* Answer region overlays */}
      {regions.map(
        (region, index) => (
          <AnswerRegionOverlay
            key={`${region.page}-${region.x}-${region.y}-${index}`}
            region={region}
            label={
              unmatchedAnswer
                ? "Unmatched"
                : `Answer ${
                    index + 1
                  }`
            }
            variant={
              unmatchedAnswer
                ? "unmatched"
                : "matched"
            }
          />
        ),
      )}

      {/* Keep TypeScript aware that
          question remains part of the
          viewer contract. */}
      {!documentPage &&
        !unmatchedAnswer &&
        question.answer && (
          <span className="sr-only">
            {question.answer}
          </span>
        )}
    </div>
  );
}

function AnswerRegionOverlay({
  region,
  label,
  variant,
}: {
  region: AnswerRegion;
  label: string;
  variant:
    | "matched"
    | "unmatched";
}) {
  const isUnmatched =
    variant === "unmatched";

  return (
    <div
      className={[
        "pointer-events-none absolute rounded-[5px]",
        "border-2 shadow-[0_0_0_2px_rgba(117,166,99,0.08)]",
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
          isUnmatched
            ? "bg-[#d87554]"
            : "bg-[#75a663]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}