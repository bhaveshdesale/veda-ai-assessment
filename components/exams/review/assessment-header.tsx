type AssessmentHeaderProps = {
  total: number;
  answered: number;
  unanswered: number;
  review: number;
};

export function AssessmentHeader({
  total,
  answered,
  unanswered,
  review,
}: AssessmentHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[#ebe7dd] px-4 py-3 sm:px-5">
      <div>
        <h1 className="text-[13px] font-bold text-[#34342f]">
          Assessment Review
        </h1>

        <p className="mt-0.5 text-[8px] text-[#99968c]">
          Class 10 Mathematics • Student Answer Sheet
        </p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="rounded-full bg-[#e8f0e4] px-3 py-1.5 text-[8px] font-semibold text-[#61755b]">
          {answered} Answered
        </span>

        <span className="rounded-full bg-[#f5eee8] px-3 py-1.5 text-[8px] font-semibold text-[#a16b51]">
          {unanswered} Unanswered
        </span>

        <span className="rounded-full bg-[#fff0e8] px-3 py-1.5 text-[8px] font-semibold text-[#e66a42]">
          {review} Review
        </span>

        <span className="ml-1 text-[8px] text-[#99968c]">
          {total} questions
        </span>
      </div>
    </header>
  );
}