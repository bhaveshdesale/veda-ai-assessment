"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { PROCESSING_STEPS } from "@/lib/constants";
import type { ProcessingStep } from "@/types/processing";

import { ProcessingSteps } from "./processing-steps";

type ProcessingPageProps = {
  questionPaperFile: File | null;
  answerSheetFile: File | null;
  onComplete: () => void;
};

export function ProcessingPage({
  questionPaperFile,
  answerSheetFile,
  onComplete,
}: ProcessingPageProps) {
  /*
   * The files are passed into this stage
   * so the real processing pipeline can
   * consume them next.
   *
   * Actual API processing will replace
   * the simulated timer in the next step.
   */
  void questionPaperFile;
  void answerSheetFile;

  const [
    currentStep,
    setCurrentStep,
  ] = useState(0);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  const isCompleted =
    currentStep >=
    PROCESSING_STEPS.length;

  const steps =
    useMemo<ProcessingStep[]>(
      () =>
        PROCESSING_STEPS.map(
          (step, index) => ({
            ...step,

            status:
              hasError &&
              index === currentStep
                ? "error"
                : index < currentStep
                  ? "completed"
                  : index ===
                      currentStep
                    ? "processing"
                    : "pending",
          }),
        ),
      [
        currentStep,
        hasError,
      ],
    );

  useEffect(() => {
    if (
      hasError ||
      isCompleted
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setCurrentStep(
          (value) => value + 1,
        );
      }, 900);

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    currentStep,
    hasError,
    isCompleted,
  ]);

  useEffect(() => {
    if (
      !isCompleted ||
      hasError
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        onComplete();
      }, 700);

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    isCompleted,
    hasError,
    onComplete,
  ]);

  const progress =
    isCompleted
      ? 100
      : Math.min(
          (currentStep /
            PROCESSING_STEPS.length) *
            100,
          95,
        );

  function handleRetry() {
    setHasError(false);
    setCurrentStep(0);
  }

  if (hasError) {
    return (
      <ProcessingError
        onRetry={
          handleRetry
        }
      />
    );
  }

  if (isCompleted) {
    return (
      <ProcessingComplete
        onContinue={
          onComplete
        }
      />
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-[500px] rounded-[20px] bg-[#fffdf8] p-7 shadow-[0_5px_25px_rgba(70,60,40,0.06)] sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe1d5]">
            <Loader2
              size={25}
              className="animate-spin text-[#f15b32]"
            />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f15b32]">
            Processing
          </p>

          <h1 className="mt-2 text-[21px] font-bold tracking-[-0.04em] text-[#34342f]">
            Analyzing assessment
          </h1>

          <p className="mx-auto mt-2 max-w-[360px] text-[10px] leading-5 text-[#8b8981]">
            We&apos;re extracting
            questions, reading the
            student&apos;s answers and
            preparing the assessment.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-medium text-[#99968c]">
              Processing
            </span>

            <span className="text-[8px] font-semibold text-[#f15b32]">
              {Math.round(
                progress,
              )}
              %
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeeae0]">
            <div
              className="h-full rounded-full bg-[#f15b32] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <ProcessingSteps
            steps={steps}
          />
        </div>

        <div className="mt-7 rounded-[10px] bg-[#f6f3eb] px-4 py-3">
          <p className="text-center text-[8px] leading-4 text-[#8f8c84]">
            Keep this window open while
            your assessment is being
            processed.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProcessingError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
      <div className="w-full max-w-[430px] rounded-[20px] bg-[#fffdf8] p-8 text-center shadow-[0_5px_25px_rgba(70,60,40,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8ddd4]">
          <AlertTriangle
            size={24}
            className="text-[#c85d3e]"
          />
        </div>

        <h1 className="mt-5 text-[20px] font-bold tracking-[-0.04em] text-[#34342f]">
          We couldn&apos;t process
          your assessment
        </h1>

        <p className="mx-auto mt-3 max-w-[340px] text-[10px] leading-5 text-[#8b8981]">
          Something went wrong while
          analyzing the uploaded
          documents. Your files are
          still available and you can
          try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-7 rounded-full bg-[#343530] px-5 py-2.5 text-[9px] font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

function ProcessingComplete({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
      <div className="w-full max-w-[430px] rounded-[20px] bg-[#fffdf8] p-8 text-center shadow-[0_5px_25px_rgba(70,60,40,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4eedf]">
          <CheckCircle2
            size={25}
            className="text-[#6d8c63]"
          />
        </div>

        <h1 className="mt-5 text-[20px] font-bold tracking-[-0.04em] text-[#34342f]">
          Assessment ready
        </h1>

        <p className="mt-2 text-[10px] leading-5 text-[#8b8981]">
          Questions and answers have
          been prepared for review.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-7 rounded-full bg-[#343530] px-5 py-2.5 text-[9px] font-semibold text-white"
        >
          Open Assessment
        </button>
      </div>
    </section>
  );
}