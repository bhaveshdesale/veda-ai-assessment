"use client";

import { useState } from "react";

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

    setStage("processing");
  }

  function handleProcessingComplete() {
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

  if (stage === "review") {
    return (
      <AssessmentPage
        answerSheetFile={
          answerSheetFile
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