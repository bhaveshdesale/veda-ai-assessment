import type { AssessmentQuestion } from "@/types/assessment";

type AnswerSheetViewerProps = {
  question: AssessmentQuestion;
};

export function AnswerSheetViewer({
  question,
}: AnswerSheetViewerProps) {
  const currentRegion = question.answerRegions[0];

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-[#e8e4db]">
      <div className="flex h-10 items-center justify-between bg-[#343530] px-4 text-white">
        <span className="text-[8px] font-medium">
          Student Answer Sheet
        </span>

        <span className="text-[8px] text-[#d2cfc7]">
          Page {currentRegion?.page ?? 1} of 6
        </span>
      </div>

      <div className="flex h-[calc(100%-40px)] items-center justify-center overflow-auto p-5 sm:p-8">
        <div className="relative min-h-[500px] w-full max-w-[380px] bg-[#fffdf8] shadow-[0_6px_25px_rgba(0,0,0,0.14)]">
          <div className="p-8">
            <div className="flex justify-between border-b border-[#e6e0d5] pb-4">
              <div>
                <p className="font-mono text-[8px] font-bold text-[#56544d]">
                  STUDENT ANSWER SHEET
                </p>

                <p className="mt-1 font-mono text-[7px] text-[#99968c]">
                  Class 10 • Mathematics
                </p>
              </div>

              <p className="font-mono text-[7px] text-[#99968c]">
                Page {currentRegion?.page ?? 1}
              </p>
            </div>

            <div className="mt-7">
              <p className="font-mono text-[8px] font-bold text-[#55534c]">
                Q. {question.number}
              </p>

              <p className="mt-3 font-mono text-[7px] leading-5 text-[#77746c]">
                {question.answer ??
                  "No handwritten answer detected for this question."}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="h-px bg-[#ebe6db]" />
              <div className="h-px bg-[#ebe6db]" />
              <div className="h-px bg-[#ebe6db]" />
              <div className="h-px bg-[#ebe6db]" />
            </div>
          </div>

          {/* Highlight */}
          {currentRegion && (
            <div
              className="pointer-events-none absolute rounded-[5px] border-2 border-[#75a663] bg-[#a9d294]/25 shadow-[0_0_0_2px_rgba(117,166,99,0.08)]"
              style={{
                left: `${currentRegion.x}%`,
                top: `${currentRegion.y}%`,
                width: `${currentRegion.width}%`,
                height: `${currentRegion.height}%`,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}