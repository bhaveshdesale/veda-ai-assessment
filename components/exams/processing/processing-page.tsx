// "use client";

// import {
//   AlertTriangle,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";
// import { useEffect, useState } from "react";

// import { PROCESSING_STEPS } from "@/lib/constants";
// import type {
//   AssessmentProcessingResult,
//   ProcessingStep,
// } from "@/types/processing";

// import { ProcessingSteps } from "./processing-steps";

// type ProcessingPageProps = {
//   questionPaperFile: File | null;
//   answerSheetFile: File | null;

//   onComplete: (
//     result: AssessmentProcessingResult,
//   ) => void;
// };

// export function ProcessingPage({
//   questionPaperFile,
//   answerSheetFile,
//   onComplete,
// }: ProcessingPageProps) {
//   const [currentStep, setCurrentStep] =
//     useState(0);

//   const [hasError, setHasError] =
//     useState(false);

//   const [errorMessage, setErrorMessage] =
//     useState(
//       "Something went wrong while processing the assessment.",
//     );

//   const [result, setResult] =
//     useState<AssessmentProcessingResult | null>(
//       null,
//     );

//   useEffect(() => {
//     if (
//       !questionPaperFile ||
//       !answerSheetFile
//     ) {
//       return;
//     }

//     let cancelled = false;

//     async function processAssessment() {
//       try {
//         setCurrentStep(0);

//         const formData = new FormData();

//         formData.append(
//           "questionPaper",
//           questionPaperFile!,
//         );

//         formData.append(
//           "answerSheet",
//           answerSheetFile!,
//         );

//         // Backend processing
//         setCurrentStep(1);

//         const response = await fetch(
//           "/api/process-assessment",
//           {
//             method: "POST",
//             body: formData,
//           },
//         );

//         setCurrentStep(2);

//         const data = await response.json();

//         if (
//           !response.ok ||
//           !data.success
//         ) {
//           throw new Error(
//             data.error ??
//               "Assessment processing failed.",
//           );
//         }

//         setCurrentStep(
//           PROCESSING_STEPS.length,
//         );

//         if (cancelled) {
//           return;
//         }

//         setResult(data.data);

//         window.setTimeout(() => {
//           if (!cancelled) {
//             onComplete(data.data);
//           }
//         }, 500);
//       } catch (error) {
//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "Processing failed:",
//           error,
//         );

//         setHasError(true);

//         setErrorMessage(
//           error instanceof Error
//             ? error.message
//             : "Failed to process assessment.",
//         );
//       }
//     }

//     void processAssessment();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     questionPaperFile,
//     answerSheetFile,
//     onComplete,
//   ]);

//   if (hasError) {
//     return (
//       <ProcessingError
//         message={errorMessage}
//         onRetry={() => {
//           window.location.reload();
//         }}
//       />
//     );
//   }

//   if (result) {
//     return (
//       <ProcessingComplete
//         onContinue={() =>
//           onComplete(result)
//         }
//       />
//     );
//   }

//   const progress = Math.min(
//     ((currentStep + 1) /
//       PROCESSING_STEPS.length) *
//       100,
//     95,
//   );

//   const steps: ProcessingStep[] =
//     PROCESSING_STEPS.map(
//       (step, index) => ({
//         ...step,
//         status:
//           index < currentStep
//             ? "completed"
//             : index === currentStep
//               ? "processing"
//               : "pending",
//       }),
//     );

//   return (
//     <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
//       <div className="w-full max-w-[500px] rounded-[20px] bg-[#fffdf8] p-7 shadow-[0_5px_25px_rgba(70,60,40,0.06)] sm:p-9">
//         <div className="text-center">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe1d5]">
//             <Loader2
//               size={25}
//               className="animate-spin text-[#f15b32]"
//             />
//           </div>

//           <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f15b32]">
//             Processing
//           </p>

//           <h1 className="mt-2 text-[21px] font-bold tracking-[-0.04em] text-[#34342f]">
//             Analyzing assessment
//           </h1>

//           <p className="mx-auto mt-2 max-w-[360px] text-[10px] leading-5 text-[#8b8981]">
//             AI is extracting questions,
//             reading answers and mapping
//             responses to questions.
//           </p>
//         </div>

//         <div className="mt-8">
//           <div className="flex items-center justify-between">
//             <span className="text-[8px] font-medium text-[#99968c]">
//               Processing
//             </span>

//             <span className="text-[8px] font-semibold text-[#f15b32]">
//               {Math.round(progress)}%
//             </span>
//           </div>

//           <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeeae0]">
//             <div
//               className="h-full rounded-full bg-[#f15b32] transition-all duration-500"
//               style={{
//                 width: `${progress}%`,
//               }}
//             />
//           </div>
//         </div>

//         <div className="mt-8">
//           <ProcessingSteps
//             steps={steps}
//           />
//         </div>

//         <div className="mt-7 rounded-[10px] bg-[#f6f3eb] px-4 py-3">
//           <p className="text-center text-[8px] leading-4 text-[#8f8c84]">
//             AI processing can take a little
//             longer for larger documents.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// function ProcessingError({
//   message,
//   onRetry,
// }: {
//   message: string;
//   onRetry: () => void;
// }) {
//   return (
//     <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
//       <div className="w-full max-w-[430px] rounded-[20px] bg-[#fffdf8] p-8 text-center shadow-[0_5px_25px_rgba(70,60,40,0.06)]">
//         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8ddd4]">
//           <AlertTriangle
//             size={24}
//             className="text-[#c85d3e]"
//           />
//         </div>

//         <h1 className="mt-5 text-[20px] font-bold tracking-[-0.04em] text-[#34342f]">
//           We couldn&apos;t process your
//           assessment
//         </h1>

//         <p className="mx-auto mt-3 max-w-[340px] text-[10px] leading-5 text-[#8b8981]">
//           {message}
//         </p>

//         <button
//           type="button"
//           onClick={onRetry}
//           className="mt-7 rounded-full bg-[#343530] px-5 py-2.5 text-[9px] font-semibold text-white"
//         >
//           Try Again
//         </button>
//       </div>
//     </section>
//   );
// }

// function ProcessingComplete({
//   onContinue,
// }: {
//   onContinue: () => void;
// }) {
//   return (
//     <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
//       <div className="w-full max-w-[430px] rounded-[20px] bg-[#fffdf8] p-8 text-center shadow-[0_5px_25px_rgba(70,60,40,0.06)]">
//         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4eedf]">
//           <CheckCircle2
//             size={25}
//             className="text-[#6d8c63]"
//           />
//         </div>

//         <h1 className="mt-5 text-[20px] font-bold tracking-[-0.04em] text-[#34342f]">
//           Assessment ready
//         </h1>

//         <p className="mt-2 text-[10px] leading-5 text-[#8b8981]">
//           Questions and answers have been
//           extracted and mapped successfully.
//         </p>

//         <button
//           type="button"
//           onClick={onContinue}
//           className="mt-7 rounded-full bg-[#343530] px-5 py-2.5 text-[9px] font-semibold text-white"
//         >
//           Open Assessment
//         </button>
//       </div>
//     </section>
//   );
// }


"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PROCESSING_STEPS } from "@/lib/constants";

import type {
  AssessmentProcessingResult,
  ProcessingStep,
} from "@/types/processing";

import { ProcessingSteps } from "./processing-steps";

type ProcessingPageProps = {
  questionPaperFile: File | null;
  answerSheetFile: File | null;

  onComplete: (
    result: AssessmentProcessingResult,
  ) => void;
};

export function ProcessingPage({
  questionPaperFile,
  answerSheetFile,
  onComplete,
}: ProcessingPageProps) {
  const [currentStep, setCurrentStep] =
    useState(0);

  const [progress, setProgress] =
    useState(5);

  const [hasError, setHasError] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState(
      "Something went wrong while processing the assessment.",
    );

  const [result, setResult] =
    useState<AssessmentProcessingResult | null>(
      null,
    );

  useEffect(() => {
    if (
      !questionPaperFile ||
      !answerSheetFile
    ) {
      return;
    }

    let cancelled = false;

    /*
     * --------------------------------------------------
     * Smooth progress simulation
     * --------------------------------------------------
     *
     * The backend currently uses one HTTP request.
     * Therefore the browser cannot know the exact
     * Gemini progress while the request is running.
     *
     * We smoothly move through the processing stages
     * and stop at 90% until the real backend response
     * arrives.
     */
    const progressTimers: ReturnType<
      typeof setTimeout
    >[] = [];

    const updateProgress = (
      value: number,
      step: number,
    ) => {
      if (cancelled) {
        return;
      }

      setProgress(value);
      setCurrentStep(step);
    };

    progressTimers.push(
      setTimeout(() => {
        updateProgress(12, 0);
      }, 500),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(22, 1);
      }, 1800),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(35, 1);
      }, 3500),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(48, 2);
      }, 6000),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(60, 2);
      }, 10000),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(70, 3);
      }, 15000),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(78, 3);
      }, 22000),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(84, 4);
      }, 30000),
    );

    progressTimers.push(
      setTimeout(() => {
        updateProgress(90, 4);
      }, 40000),
    );

    /*
     * After 40 seconds, keep the progress moving
     * very slowly between 90 and 94 while we wait.
     *
     * This prevents the UI from looking frozen if
     * Gemini takes longer for a large handwritten PDF.
     */
    let slowProgressInterval:
      ReturnType<typeof setInterval> | null =
      null;

    const slowProgressStart = setTimeout(() => {
      slowProgressInterval =
        setInterval(() => {
          if (cancelled) {
            return;
          }

          setProgress((previous) => {
            if (previous >= 94) {
              return previous;
            }

            return previous + 1;
          });
        }, 5000);
    }, 45000);

    /*
     * --------------------------------------------------
     * Actual assessment processing
     * --------------------------------------------------
     */
    async function processAssessment() {
      try {
        setCurrentStep(0);
        setProgress(5);
        setHasError(false);

        const formData =
          new FormData();

        formData.append(
          "questionPaper",
          questionPaperFile!,
        );

        formData.append(
          "answerSheet",
          answerSheetFile!,
        );

        /*
         * Start actual backend processing.
         */
        const response =
          await fetch(
            "/api/process-assessment",
            {
              method: "POST",
              body: formData,
            },
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ??
              "Assessment processing failed.",
          );
        }

        if (cancelled) {
          return;
        }

        /*
         * Backend has actually completed.
         * Now it is safe to show 100%.
         */
        setCurrentStep(
          PROCESSING_STEPS.length,
        );

        setProgress(100);

        setResult(data.data);

        /*
         * Small delay so the user can visually
         * see the completed state before opening
         * the assessment.
         */
        window.setTimeout(() => {
          if (!cancelled) {
            onComplete(data.data);
          }
        }, 700);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Processing failed:",
          error,
        );

        setHasError(true);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to process assessment.",
        );
      }
    }

    void processAssessment();

    /*
     * --------------------------------------------------
     * Cleanup
     * --------------------------------------------------
     */
    return () => {
      cancelled = true;

      progressTimers.forEach(
        (timer) => {
          clearTimeout(timer);
        },
      );

      clearTimeout(
        slowProgressStart,
      );

      if (
        slowProgressInterval
      ) {
        clearInterval(
          slowProgressInterval,
        );
      }
    };
  }, [
    questionPaperFile,
    answerSheetFile,
    onComplete,
  ]);

  /*
   * --------------------------------------------------
   * Error state
   * --------------------------------------------------
   */
  if (hasError) {
    return (
      <ProcessingError
        message={errorMessage}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  /*
   * --------------------------------------------------
   * Completed state
   * --------------------------------------------------
   */
  if (result) {
    return (
      <ProcessingComplete
        onContinue={() =>
          onComplete(result)
        }
      />
    );
  }

  /*
   * --------------------------------------------------
   * Processing steps
   * --------------------------------------------------
   */
  const steps: ProcessingStep[] =
    PROCESSING_STEPS.map(
      (step, index) => {
        let status:
          | "pending"
          | "processing"
          | "completed"
          | "error";

        if (
          index < currentStep
        ) {
          status = "completed";
        } else if (
          index === currentStep
        ) {
          status = "processing";
        } else {
          status = "pending";
        }

        return {
          ...step,
          status,
        };
      },
    );

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-[560px] rounded-[20px] bg-[#fffdf8] p-7 shadow-[0_5px_25px_rgba(70,60,40,0.06)] sm:p-9">
        {/* Header */}
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

          <p className="mx-auto mt-2 max-w-[400px] text-[10px] leading-5 text-[#8b8981]">
            AI is extracting questions,
            reading answers and mapping
            responses to questions.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-medium text-[#99968c]">
              Processing
            </span>

            <span className="text-[8px] font-semibold text-[#f15b32]">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeeae0]">
            <div
              className="h-full rounded-full bg-[#f15b32] transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8">
          <ProcessingSteps
            steps={steps}
          />
        </div>

        {/* Dynamic status message */}
        <div className="mt-7 rounded-[10px] bg-[#f6f3eb] px-4 py-3">
          <p className="text-center text-[8px] leading-4 text-[#8f8c84]">
            {progress >= 90
              ? "Almost done. Finalizing your assessment..."
              : currentStep === 0
                ? "Reading the uploaded question paper..."
                : currentStep === 1
                  ? "Identifying questions, sub-parts and marks..."
                  : currentStep === 2
                    ? "Reading student responses from the answer sheet..."
                    : currentStep === 3
                      ? "Associating student answers with questions..."
                      : "Building the final assessment for review..."}
          </p>
        </div>
      </div>
    </section>
  );
}

/*
 * ======================================================
 * Processing Error
 * ======================================================
 */

function ProcessingError({
  message,
  onRetry,
}: {
  message: string;
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
          We couldn&apos;t process your
          assessment
        </h1>

        <p className="mx-auto mt-3 max-w-[340px] text-[10px] leading-5 text-[#8b8981]">
          {message}
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

/*
 * ======================================================
 * Processing Complete
 * ======================================================
 */

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
          been extracted and mapped
          successfully.
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