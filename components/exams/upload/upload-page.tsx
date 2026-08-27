"use client";

import {
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import { useState } from "react";

import type {
  UploadError,
  UploadFile,
} from "@/types/upload";

import { UploadCard } from "./upload-card";

type UploadPageProps = {
  onStartMapping: (
    questionPaper: File,
    answerSheet: File,
  ) => void;
};

export function UploadPage({
  onStartMapping,
}: UploadPageProps) {
  const [
    questionPaper,
    setQuestionPaper,
  ] = useState<UploadFile | null>(
    null,
  );

  const [
    questionPaperError,
    setQuestionPaperError,
  ] = useState<UploadError | null>(
    null,
  );

  const [
    answerSheet,
    setAnswerSheet,
  ] = useState<UploadFile | null>(
    null,
  );

  const [
    answerSheetError,
    setAnswerSheetError,
  ] = useState<UploadError | null>(
    null,
  );

  const canStart =
    questionPaper !== null &&
    answerSheet !== null;

  function updateQuestionPaper(
    file: UploadFile | null,
    error: UploadError | null,
  ) {
    setQuestionPaper(file);
    setQuestionPaperError(error);
  }

  function updateAnswerSheet(
    file: UploadFile | null,
    error: UploadError | null,
  ) {
    setAnswerSheet(file);
    setAnswerSheetError(error);
  }

  function handleStartMapping() {
    if (
      !questionPaper ||
      !answerSheet
    ) {
      return;
    }

    onStartMapping(
      questionPaper.file,
      answerSheet.file,
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center px-5 py-10 sm:py-14">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe1d5] text-[#f15b32]">
          <FileCheck2 size={19} />
        </div>

        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f15b32]">
          AI Assessment
        </p>

        <h1 className="mt-2 text-[25px] font-bold tracking-[-0.05em] text-[#34342f] sm:text-[30px]">
          Upload your documents
        </h1>

        <p className="mx-auto mt-2 max-w-[430px] text-[10px] leading-5 text-[#77746c] sm:text-[11px]">
          Upload the question paper and one
          student answer sheet to extract,
          map and review the assessment.
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-[680px] gap-4 sm:grid-cols-2">
        <UploadCard
          title="Question Paper"
          description="PDF or image • Max 10MB"
          kind="question-paper"
          file={questionPaper}
          error={questionPaperError}
          onFileChange={
            updateQuestionPaper
          }
        />

        <UploadCard
          title="Answer Sheet"
          description="PDF or image • Max 10MB"
          kind="answer-sheet"
          file={answerSheet}
          error={answerSheetError}
          onFileChange={
            updateAnswerSheet
          }
        />
      </div>

      <div className="mt-7 flex flex-col items-center">
        <button
          type="button"
          disabled={!canStart}
          onClick={
            handleStartMapping
          }
          className={[
            "flex h-[36px] items-center gap-2 rounded-full px-6",
            "text-[9px] font-semibold transition-all",
            canStart
              ? "bg-[#343530] text-white shadow-sm hover:bg-[#292a25]"
              : "cursor-not-allowed bg-[#dedbd2] text-[#aaa69d]",
          ].join(" ")}
        >
          Start Mapping

          <ArrowRight size={13} />
        </button>

        {!canStart && (
          <p className="mt-2 text-[8px] text-[#aaa69d]">
            Upload both documents to continue
          </p>
        )}
      </div>
    </section>
  );
}