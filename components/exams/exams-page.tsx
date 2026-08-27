"use client";

import { useState } from "react";

import type {
  AssessmentProcessingResult,
} from "@/types/processing";

import { ProcessingPage } from "./processing/processing-page";
import { AssessmentPage } from "./review/assessment-page";
import { UploadPage } from "./upload/upload-page";

type ExamStage =
  | "upload"
  | "processing"
  | "review";

export function ExamsPage() {
  const [stage, setStage] =
    useState<ExamStage>("upload");

  const [
    questionPaperFile,
    setQuestionPaperFile,
  ] = useState<File | null>(null);

  const [
    answerSheetFile,
    setAnswerSheetFile,
  ] = useState<File | null>(null);

  const [
    processingResult,
    setProcessingResult,
  ] =
    useState<AssessmentProcessingResult | null>(
      null,
    );

  function handleStartMapping(
    questionPaper: File,
    answerSheet: File,
  ) {
    setQuestionPaperFile(
      questionPaper,
    );

    setAnswerSheetFile(
      answerSheet,
    );

    setProcessingResult(null);

    setStage("processing");
  }

  function handleProcessingComplete(
    result: AssessmentProcessingResult,
  ) {
    setProcessingResult(result);
    setStage("review");
  }

  if (stage === "processing") {
    return (
      <ProcessingPage
        questionPaperFile={
          questionPaperFile
        }
        answerSheetFile={
          answerSheetFile
        }
        onComplete={
          handleProcessingComplete
        }
      />
    );
  }

  if (
    stage === "review" &&
    processingResult
  ) {
    return (
      <AssessmentPage
        answerSheetFile={
          answerSheetFile
        }
        processingResult={
          processingResult
        }
      />
    );
  }

  return (
    <UploadPage
      onStartMapping={
        handleStartMapping
      }
    />
  );
}