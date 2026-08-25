"use client";

import { ArrowRight, FileText, ImageIcon, Upload } from "lucide-react";
import { useState } from "react";

type UploadPageProps = {
  onStartMapping: () => void;
};

type UploadedFile = {
  name: string;
  size: string;
};

export function UploadPage({
  onStartMapping,
}: UploadPageProps) {
  const [questionPaper, setQuestionPaper] =
    useState<UploadedFile | null>(null);

  const [answerSheet, setAnswerSheet] =
    useState<UploadedFile | null>(null);

  function handleQuestionPaperUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setQuestionPaper({
      name: file.name,
      size: formatFileSize(file.size),
    });
  }

  function handleAnswerSheetUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAnswerSheet({
      name: file.name,
      size: formatFileSize(file.size),
    });
  }

  const canStart =
    questionPaper !== null && answerSheet !== null;

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center px-5 py-10 sm:py-14">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-[25px] font-bold tracking-[-0.05em] text-[#34342f] sm:text-[30px]">
          Upload{" "}
          <span className="text-[#f15b32]">
            Question Paper &amp; Answer Sheets
          </span>
        </h1>

        <p className="mt-2 text-[10px] text-[#77746c] sm:text-[11px]">
          Upload both files to get started
        </p>
      </div>

      {/* Illustration */}
      <div className="relative mt-7 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#f8d9cc]">
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#f3bba4]">
          <div className="text-[34px]">👩🏻‍🏫</div>
        </div>

        <div className="absolute -right-1 top-3 rounded-[5px] bg-white px-1.5 py-1 text-[8px] shadow-sm">
          ✓
        </div>

        <div className="absolute -left-2 bottom-2 rounded-[5px] bg-white px-1.5 py-1 text-[8px] shadow-sm">
          📄
        </div>
      </div>

      {/* Upload cards */}
      <div className="mt-7 grid w-full max-w-[570px] gap-3 sm:grid-cols-2">
        <UploadCard
          title="Question Paper"
          description="PDF or image"
          file={questionPaper}
          onUpload={handleQuestionPaperUpload}
          onRemove={() => setQuestionPaper(null)}
        />

        <UploadCard
          title="Answer Sheet"
          description="PDF or image"
          file={answerSheet}
          onUpload={handleAnswerSheetUpload}
          onRemove={() => setAnswerSheet(null)}
        />
      </div>

      {/* Start */}
      <button
        type="button"
        disabled={!canStart}
        onClick={onStartMapping}
        className={[
          "mt-6 flex h-[34px] items-center gap-2 rounded-full px-5 text-[9px] font-semibold transition-all",
          canStart
            ? "bg-[#343530] text-white hover:bg-[#272822]"
            : "cursor-not-allowed bg-[#dedbd2] text-[#aaa69d]",
        ].join(" ")}
      >
        Start Mapping
        <ArrowRight size={13} />
      </button>

      <p className="mt-3 text-center text-[8px] text-[#aaa69d]">
        Supported formats: PDF, JPG, JPEG and PNG
      </p>
    </section>
  );
}

type UploadCardProps = {
  title: string;
  description: string;
  file: UploadedFile | null;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemove: () => void;
};

function UploadCard({
  title,
  description,
  file,
  onUpload,
  onRemove,
}: UploadCardProps) {
  return (
    <div className="rounded-[15px] bg-[#fffaf0] p-2">
      <label
        className={[
          "relative flex min-h-[135px] cursor-pointer flex-col items-center justify-center rounded-[11px]",
          "border border-dashed transition-colors",
          file
            ? "border-[#9ab18e] bg-[#f8fbf5]"
            : "border-[#d6d0c3] bg-[#fffdf8] hover:border-[#f15b32]",
        ].join(" ")}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onUpload}
          className="sr-only"
        />

        {file ? (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#e4eedf] text-[#6d8c63]">
              <FileText size={15} />
            </div>

            <p className="mt-2 max-w-[180px] truncate text-[10px] font-semibold text-[#494841]">
              {file.name}
            </p>

            <p className="mt-1 text-[8px] text-[#99968c]">
              {file.size}
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onRemove();
              }}
              className="mt-2 text-[8px] font-semibold text-[#e56a43]"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f1eee6] text-[#77746c]">
              <Upload size={15} />
            </div>

            <p className="mt-3 text-[10px] font-semibold text-[#494841]">
              Upload{" "}
              <span className="text-[#f15b32]">
                {title}
              </span>
            </p>

            <p className="mt-1 text-[8px] text-[#aaa69d]">
              {description} • Max 10MB
            </p>
          </>
        )}
      </label>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}