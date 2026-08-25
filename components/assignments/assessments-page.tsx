import { MoreHorizontal, Plus } from "lucide-react";

const assignments = [
  {
    title: "Algebra Practice",
    className: "Class 10 Mathematics",
    due: "Tomorrow",
    status: "Review",
  },
  {
    title: "Chemical Reactions",
    className: "Class 10 Science",
    due: "Friday",
    status: "Active",
  },
  {
    title: "Python Basics",
    className: "Class 8 Computer Science",
    due: "Completed",
    status: "Complete",
  },
  {
    title: "Geometry Worksheet",
    className: "Class 9 Mathematics",
    due: "Monday",
    status: "Active",
  },
];

export function AssignmentsPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f15b32]">
            Teaching
          </p>

          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.05em] text-[#34342f]">
            Assignments
          </h1>

          <p className="mt-2 text-[11px] text-[#85837a]">
            Create, review and manage student assignments.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-full bg-[#343530] px-4 py-2.5 text-[9px] font-semibold text-white"
        >
          <Plus size={12} />
          New Assignment
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[16px] bg-[#fffdf8] shadow-[0_2px_12px_rgba(70,60,40,0.05)]">
        {assignments.map((assignment) => (
          <div
            key={assignment.title}
            className="grid gap-3 border-b border-[#eeeae0] p-5 last:border-0 sm:grid-cols-[1.6fr_1fr_0.6fr_auto] sm:items-center"
          >
            <div>
              <p className="text-[11px] font-semibold text-[#34342f]">
                {assignment.title}
              </p>

              <p className="mt-1 text-[9px] text-[#99968c]">
                {assignment.className}
              </p>
            </div>

            <p className="text-[9px] text-[#77746c]">
              Due {assignment.due}
            </p>

            <span className="w-fit rounded-full bg-[#f1eee6] px-3 py-1 text-[8px] font-semibold text-[#66645d]">
              {assignment.status}
            </span>

            <button
              type="button"
              aria-label={`More options for ${assignment.title}`}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#99968c] hover:bg-[#f1eee6]"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}