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
      <div className="min-w-0">
        <h1 className="truncate text-[13px] font-bold text-[#34342f]">
          Assessment Review
        </h1>

        <p className="mt-0.5 truncate text-[8px] text-[#99968c]">
          Class 10 Mathematics • Student Answer Sheet
        </p>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1.5">
        <StatusPill
          label="Answered"
          value={answered}
          className="bg-[#e8f0e4] text-[#61755b]"
        />

        <StatusPill
          label="Unanswered"
          value={unanswered}
          className="bg-[#f5eee8] text-[#a16b51]"
        />

        <StatusPill
          label="Review"
          value={review}
          className="bg-[#fff0e8] text-[#e66a42]"
        />

        <span className="hidden text-[8px] text-[#99968c] sm:inline">
          {total} questions
        </span>
      </div>
    </header>
  );
}

function StatusPill({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <span
      className={[
        "rounded-full px-2 py-1 text-[7px]",
        "font-semibold sm:px-3 sm:py-1.5 sm:text-[8px]",
        className,
      ].join(" ")}
    >
      <span className="hidden sm:inline">
        {label}{" "}
      </span>

      {value}
    </span>
  );
}