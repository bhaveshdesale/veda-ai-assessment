"use client";

import { useState } from "react";
import { UploadPage } from "./upload/upload-page";
import { ProcessingPage } from "./processing/processing-page";
import { AssessmentPage } from "./review/assessment-page";

type ExamStage = "upload" | "processing" | "review";

export function ExamsPage() {
  const [stage, setStage] = useState<ExamStage>("upload");

  function handleStartMapping() {
    setStage("processing");
  }

  function handleProcessingComplete() {
    setStage("review");
  }

  if (stage === "processing") {
    return (
      <ProcessingPage
        onComplete={handleProcessingComplete}
      />
    );
  }

  if (stage === "review") {
    return <AssessmentPage />;
  }

  return (
    <UploadPage
      onStartMapping={handleStartMapping}
    />
  );
}