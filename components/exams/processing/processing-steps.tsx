import {
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

type ProcessingStepsProps = {
  currentStep: number;
};

const steps = [
  "Reading question paper",
  "Extracting questions",
  "Reading answer sheet",
  "Mapping answers",
  "Preparing assessment",
];

export function ProcessingSteps({
  currentStep,
}: ProcessingStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;

        return (
          <div
            key={step}
            className="flex items-center gap-3"
          >
            {completed ? (
              <CheckCircle2
                size={17}
                className="text-[#6d8c63]"
              />
            ) : active ? (
              <Loader2
                size={17}
                className="animate-spin text-[#f15b32]"
              />
            ) : (
              <Circle
                size={17}
                className="text-[#c8c4ba]"
              />
            )}

            <span
              className={[
                "text-[10px]",
                completed || active
                  ? "font-medium text-[#494841]"
                  : "text-[#aaa69d]",
              ].join(" ")}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}