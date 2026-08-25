// import {
//   CheckCircle2,
//   Circle,
//   Loader2,
// } from "lucide-react";

// type ProcessingStepsProps = {
//   currentStep: number;
// };

// const steps = [
//   "Reading question paper",
//   "Extracting questions",
//   "Reading answer sheet",
//   "Mapping answers",
//   "Preparing assessment",
// ];

// export function ProcessingSteps({
//   currentStep,
// }: ProcessingStepsProps) {
//   return (
//     <div className="space-y-4">
//       {steps.map((step, index) => {
//         const completed = index < currentStep;
//         const active = index === currentStep;

//         return (
//           <div
//             key={step}
//             className="flex items-center gap-3"
//           >
//             {completed ? (
//               <CheckCircle2
//                 size={17}
//                 className="text-[#6d8c63]"
//               />
//             ) : active ? (
//               <Loader2
//                 size={17}
//                 className="animate-spin text-[#f15b32]"
//               />
//             ) : (
//               <Circle
//                 size={17}
//                 className="text-[#c8c4ba]"
//               />
//             )}

//             <span
//               className={[
//                 "text-[10px]",
//                 completed || active
//                   ? "font-medium text-[#494841]"
//                   : "text-[#aaa69d]",
//               ].join(" ")}
//             >
//               {step}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

import type { ProcessingStep } from "@/types/processing";

type ProcessingStepsProps = {
  steps: ProcessingStep[];
};

export function ProcessingSteps({
  steps,
}: ProcessingStepsProps) {
  return (
    <div className="space-y-5">
      {steps.map((step) => {
        const isCompleted =
          step.status === "completed";

        const isProcessing =
          step.status === "processing";

        const isError =
          step.status === "error";

        return (
          <div
            key={step.id}
            className="flex gap-3"
          >
            <div className="relative flex shrink-0 flex-col items-center">
              {isCompleted ? (
                <CheckCircle2
                  size={18}
                  className="text-[#6d8c63]"
                />
              ) : isProcessing ? (
                <Loader2
                  size={18}
                  className="animate-spin text-[#f15b32]"
                />
              ) : isError ? (
                <AlertCircle
                  size={18}
                  className="text-[#c85d3e]"
                />
              ) : (
                <Circle
                  size={18}
                  className="text-[#c8c4ba]"
                />
              )}

              {step.id !==
                steps[steps.length - 1].id && (
                <span
                  className={[
                    "absolute top-6 h-5 w-px",
                    isCompleted
                      ? "bg-[#b7c9ae]"
                      : "bg-[#e3dfd5]",
                  ].join(" ")}
                />
              )}
            </div>

            <div className="min-w-0">
              <p
                className={[
                  "text-[10px] font-medium",
                  isCompleted || isProcessing
                    ? "text-[#494841]"
                    : isError
                      ? "text-[#a45138]"
                      : "text-[#aaa69d]",
                ].join(" ")}
              >
                {step.label}
              </p>

              <p className="mt-1 text-[8px] leading-4 text-[#aaa69d]">
                {step.description}
              </p>

              {isError && (
                <p className="mt-1 text-[8px] font-medium text-[#c85d3e]">
                  This step could not be completed.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}