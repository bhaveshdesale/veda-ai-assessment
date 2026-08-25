"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProcessingSteps } from "./processing-steps";

type ProcessingPageProps = {
  onComplete: () => void;
};

const TOTAL_STEPS = 5;

export function ProcessingPage({
  onComplete,
}: ProcessingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= TOTAL_STEPS) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 600);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((value) => value + 1);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = Math.min(
    (currentStep / TOTAL_STEPS) * 100,
    100,
  );

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
      <div className="w-full max-w-[470px] rounded-[20px] bg-[#fffdf8] p-7 shadow-[0_5px_25px_rgba(70,60,40,0.06)] sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe1d5]">
            <Loader2
              size={25}
              className="animate-spin text-[#f15b32]"
            />
          </div>

          <h1 className="mt-5 text-[21px] font-bold tracking-[-0.04em] text-[#34342f]">
            Analyzing Assessment
          </h1>

          <p className="mt-2 text-[10px] leading-5 text-[#8b8981]">
            We&apos;re extracting questions and mapping student
            answers.
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
              className="h-full rounded-full bg-[#f15b32] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <ProcessingSteps
            currentStep={currentStep}
          />
        </div>
      </div>
    </section>
  );
}