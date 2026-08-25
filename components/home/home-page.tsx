import Link from "next/link";
import { ArrowRight, BookOpen, FileCheck2, Users } from "lucide-react";

const stats = [
  {
    label: "Active Classes",
    value: "06",
    description: "Across this semester",
    icon: Users,
  },
  {
    label: "Assignments",
    value: "24",
    description: "12 awaiting review",
    icon: BookOpen,
  },
  {
    label: "Assessments",
    value: "08",
    description: "3 currently active",
    icon: FileCheck2,
  },
];

export function HomePage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 sm:p-8 lg:p-10">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f15b32]">
          Dashboard
        </p>

        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.05em] text-[#34342f]">
          Good morning, Madhur
        </h1>

        <p className="mt-2 text-[11px] text-[#85837a]">
          Here&apos;s an overview of your teaching activity.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[16px] bg-[#fffdf8] p-5 shadow-[0_2px_12px_rgba(70,60,40,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-medium text-[#8b8981]">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-[#34342f]">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#fbe4da] text-[#f15b32]">
                  <Icon size={16} />
                </div>
              </div>

              <p className="mt-2 text-[9px] text-[#a09d94]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[16px] bg-[#fffdf8] p-6 shadow-[0_2px_12px_rgba(70,60,40,0.05)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#34342f]">
              Recent activity
            </h2>

            <span className="text-[9px] text-[#9b988f]">This week</span>
          </div>

          <div className="mt-5 space-y-4">
            {[
              "Class 10 Mathematics assessment uploaded",
              "12 assignments reviewed",
              "Science assessment completed",
              "New classroom added",
            ].map((activity) => (
              <div
                key={activity}
                className="flex items-center gap-3 border-b border-[#eeeae0] pb-3 last:border-0"
              >
                <span className="h-2 w-2 rounded-full bg-[#f15b32]" />

                <p className="text-[10px] text-[#66645d]">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] bg-[#343530] p-6 text-white">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#f7aa90]">
            AI Teacher&apos;s Toolkit
          </p>

          <h2 className="mt-3 text-[20px] font-bold tracking-[-0.04em]">
            Review assessments faster.
          </h2>

          <p className="mt-3 text-[10px] leading-5 text-[#d1cec4]">
            Upload a question paper and student answer sheet to map answers and
            review the assessment.
          </p>

          <Link
            href="/exams"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f15b32] px-4 py-2 text-[9px] font-semibold"
          >
            Open Exams
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
