import { ArrowRight, Users } from "lucide-react";

const classrooms = [
  {
    name: "Class 10 - Mathematics",
    students: "32 students",
    assignments: "12 assignments",
  },
  {
    name: "Class 10 - Science",
    students: "28 students",
    assignments: "9 assignments",
  },
  {
    name: "Class 9 - Mathematics",
    students: "35 students",
    assignments: "14 assignments",
  },
  {
    name: "Class 8 - Computer Science",
    students: "26 students",
    assignments: "7 assignments",
  },
];

export function ClassroomPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 sm:p-8 lg:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f15b32]">
        Teaching
      </p>

      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.05em] text-[#34342f]">
            My Classroom
          </h1>

          <p className="mt-2 text-[11px] text-[#85837a]">
            Manage your classes and student activity.
          </p>
        </div>

        <button
          type="button"
          className="w-fit rounded-full bg-[#343530] px-5 py-2.5 text-[9px] font-semibold text-white"
        >
          + New Classroom
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {classrooms.map((classroom) => (
          <div
            key={classroom.name}
            className="rounded-[16px] bg-[#fffdf8] p-6 shadow-[0_2px_12px_rgba(70,60,40,0.05)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f1eee6] text-[#68665f]">
              <Users size={17} />
            </div>

            <h2 className="mt-5 text-[14px] font-bold text-[#34342f]">
              {classroom.name}
            </h2>

            <div className="mt-3 flex gap-4 text-[9px] text-[#8b8981]">
              <span>{classroom.students}</span>
              <span>{classroom.assignments}</span>
            </div>

            <button
              type="button"
              className="mt-6 flex items-center gap-1 text-[9px] font-semibold text-[#f15b32]"
            >
              View classroom
              <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}