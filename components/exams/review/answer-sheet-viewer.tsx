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

import { ViewerControls } from "./viewer-controls";

type AnswerSheetViewerProps = {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
};

const TOTAL_DOCUMENT_PAGES = 10;

export function AnswerSheetViewer({
  question,
  unmatchedAnswer,
}: AnswerSheetViewerProps) {
  const regions = useMemo<AnswerRegion[]>(
    () =>
      unmatchedAnswer?.regions ??
      question.answerMatch?.regions ??
      [],
    [question.answerMatch?.regions, unmatchedAnswer?.regions],
  );

  const pagesWithAnswers = useMemo(() => {
    return Array.from(
      new Set(
        regions.map((region) => region.page),
      ),
    ).sort((a, b) => a - b);
  }, [regions]);

  const firstRelevantPage =
    pagesWithAnswers[0] ?? 1;

  return (
    <ViewerContent
      key={`${question.id}-${unmatchedAnswer?.id ?? "question"}`}
      question={question}
      unmatchedAnswer={unmatchedAnswer}
      regions={regions}
      pagesWithAnswers={pagesWithAnswers}
      firstRelevantPage={firstRelevantPage}
    />
  );
}

function ViewerContent({
  question,
  unmatchedAnswer,
  regions,
  pagesWithAnswers,
  firstRelevantPage,
}: {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
  regions: AnswerRegion[];
  pagesWithAnswers: number[];
  firstRelevantPage: number;
}) {
  const [currentPage, setCurrentPage] =
    useState(firstRelevantPage);

  const [zoom, setZoom] = useState(100);

  const currentPageRegions = regions.filter(
    (region) => region.page === currentPage,
  );

  function previousPage() {
    setCurrentPage((page) =>
      Math.max(1, page - 1),
    );
  }

  function nextPage() {
    setCurrentPage((page) =>
      Math.min(
        TOTAL_DOCUMENT_PAGES,
        page + 1,
      ),
    );
  }

  function zoomIn() {
    setZoom((value) =>
      Math.min(150, value + 10),
    );
  }

  function zoomOut() {
    setZoom((value) =>
      Math.max(70, value - 10),
    );
  }

  function resetZoom() {
    setZoom(100);
  }

  function jumpToAnswer() {
    setCurrentPage(firstRelevantPage);
  }

  return (
    <section className="flex min-h-0 flex-col overflow-hidden bg-[#e8e4db]">
      <div className="flex h-10 shrink-0 items-center justify-between bg-[#343530] px-4 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[8px] font-medium">
            Student Answer Sheet
          </span>

          {regions.length > 0 && (
            <span className="hidden rounded-full bg-[#4c4d46] px-2 py-0.5 text-[7px] text-[#d7d5cf] sm:inline">
              {regions.length} highlighted{" "}
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

      <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-8">
        <div className="flex min-h-full min-w-full items-start justify-center">
          <div
            className="relative shrink-0 bg-[#fffdf8] shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-[width,min-height] duration-200"
            style={{
              width: `${380 * (zoom / 100)}px`,
              minHeight: `${500 * (zoom / 100)}px`,
            }}
          >
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                width: `${100 / (zoom / 100)}%`,
                transform: `scale(${zoom / 100})`,
              }}
            >
              <DocumentPage
                question={question}
                unmatchedAnswer={unmatchedAnswer}
                currentPage={currentPage}
                totalPages={TOTAL_DOCUMENT_PAGES}
                regions={currentPageRegions}
              />
            </div>
          </div>
        </div>
      </div>

      <ViewerControls
        currentPage={currentPage}
        totalPages={TOTAL_DOCUMENT_PAGES}
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

function DocumentPage({
  question,
  unmatchedAnswer,
  currentPage,
  totalPages,
  regions,
}: {
  question: AssessmentQuestion;
  unmatchedAnswer?: UnmatchedAnswer | null;
  currentPage: number;
  totalPages: number;
  regions: AnswerRegion[];
}) {
  return (
    <div className="relative min-h-[500px] w-[380px] bg-[#fffdf8]">
      <div className="p-8">
        <div className="flex justify-between border-b border-[#e6e0d5] pb-4">
          <div>
            <p className="font-mono text-[8px] font-bold text-[#56544d]">
              STUDENT ANSWER SHEET
            </p>

            <p className="mt-1 font-mono text-[7px] text-[#99968c]">
              Class 10 • Mathematics
            </p>
          </div>

          <p className="font-mono text-[7px] text-[#99968c]">
            Page {currentPage} / {totalPages}
          </p>
        </div>

        <div className="mt-7">
          <p className="font-mono text-[8px] font-bold text-[#55534c]">
            {unmatchedAnswer
              ? "Unmatched response"
              : `Q. ${question.number}`}
          </p>

          <p className="mt-3 font-mono text-[7px] leading-5 text-[#77746c]">
            {unmatchedAnswer?.text ??
              question.answer ??
              "No handwritten answer detected for this question."}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-px bg-[#ebe6db]"
              />
            ),
          )}
        </div>

        <div className="mt-10 space-y-2">
          <div className="h-2 w-32 rounded bg-[#f1eee6]" />
          <div className="h-2 w-48 rounded bg-[#f1eee6]" />
          <div className="h-2 w-40 rounded bg-[#f1eee6]" />
        </div>
      </div>

      {regions.map((region, index) => (
        <div
          key={`${region.page}-${index}`}
          className={[
            "pointer-events-none absolute rounded-[5px]",
            "border-2 shadow-[0_0_0_2px_rgba(117,166,99,0.08)]",
            unmatchedAnswer
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
              unmatchedAnswer
                ? "bg-[#d87554]"
                : "bg-[#75a663]",
            ].join(" ")}
          >
            {unmatchedAnswer
              ? "Unmatched"
              : `Answer ${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}