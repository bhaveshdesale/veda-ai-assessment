import { Sparkles } from "lucide-react";

export function OverallFeedback() {
  return (
    <div className="mt-6 rounded-[13px] border border-[#eee6dc] bg-[#fffaf5] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbe1d5]">
          <Sparkles
            size={13}
            className="text-[#f15b32]"
          />
        </div>

        <div>
          <p className="text-[9px] font-semibold text-[#34342f]">
            Overall Feedback
          </p>

          <p className="text-[7px] text-[#aaa69d]">
            AI-generated assessment summary
          </p>
        </div>
      </div>

      <p className="mt-3 text-[9px] leading-5 text-[#77746c]">
        The student demonstrates a good understanding
        of the core concepts. Most answers correctly
        address the main ideas, although some responses
        would benefit from additional explanation and
        supporting examples.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <FeedbackGroup
          title="Strengths"
          items={[
            "Strong conceptual understanding",
            "Correct key definitions",
          ]}
        />

        <FeedbackGroup
          title="Needs improvement"
          items={[
            "Add supporting examples",
            "Explain multi-step reasoning",
          ]}
        />
      </div>
    </div>
  );
}

function FeedbackGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-[8px] font-semibold text-[#56544d]">
        {title}
      </p>

      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[8px] leading-4 text-[#8a877f]"
          >
            <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#c2bdb1]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}