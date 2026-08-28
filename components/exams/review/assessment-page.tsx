"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  UnmatchedAnswer,
} from "@/types/assessment";

import type {
  AssessmentProcessingResult,
} from "@/types/processing";

import {
  buildAssessmentQuestions,
  buildUnmatchedAnswers,
} from "@/lib/assessment/assessment-adapter";

import { AnswerSheetViewer } from "./answer-sheet-viewer";
import { AssessmentHeader } from "./assessment-header";
import { AssessmentSummary } from "./assessment-summary";
import { QuestionDetail } from "./question-detail";
import { QuestionList } from "./question-list";
import { ReviewMobileTabs } from "./review-mobile-tabs";

type ReviewTab =
  | "questions"
  | "answer"
  | "sheet";

type AssessmentPageProps = {
  answerSheetFile: File | null;

  processingResult: AssessmentProcessingResult;
};

export function AssessmentPage({
  answerSheetFile,
  processingResult,
}: AssessmentPageProps) {
  /*
   * ============================================================
   * BUILD ASSESSMENT QUESTIONS
   * ============================================================
   *
   * Converts:
   *
   * questions
   * answers
   * mappings
   * grading
   *
   * into the structure used by the review UI.
   */
  const assessmentQuestions =
    useMemo(
      () =>
        buildAssessmentQuestions(
          processingResult,
        ),
      [processingResult],
    );

  /*
   * ============================================================
   * BUILD UNMATCHED ANSWERS
   * ============================================================
   */
  const unmatchedAnswers =
    useMemo(
      () =>
        buildUnmatchedAnswers(
          processingResult,
        ),
      [processingResult],
    );

  /*
   * ============================================================
   * SELECTED QUESTION
   * ============================================================
   *
   * We keep the selected question ID
   * as state.
   *
   * No useEffect is necessary here.
   */
  const [
    selectedId,
    setSelectedId,
  ] = useState(
    assessmentQuestions[0]?.id ??
      "",
  );

  /*
   * Currently selected unmatched answer.
   */
  const [
    selectedUnmatchedAnswer,
    setSelectedUnmatchedAnswer,
  ] =
    useState<UnmatchedAnswer | null>(
      null,
    );

  /*
   * Mobile navigation.
   */
  const [
    mobileTab,
    setMobileTab,
  ] =
    useState<ReviewTab>(
      "questions",
    );

  /*
   * ============================================================
   * SELECTED QUESTION
   * ============================================================
   */
  const selectedQuestion =
    useMemo(() => {
      return (
        assessmentQuestions.find(
          (question) =>
            question.id ===
            selectedId,
        ) ??
        assessmentQuestions[0] ??
        null
      );
    }, [
      assessmentQuestions,
      selectedId,
    ]);

  /*
   * ============================================================
   * SUMMARY
   * ============================================================
   */
  const summary =
    useMemo(() => {
      const totalMarks =
        assessmentQuestions.reduce(
          (
            total,
            question,
          ) =>
            total +
            question.marks,
          0,
        );

      const obtainedMarks =
        assessmentQuestions.reduce(
          (
            total,
            question,
          ) =>
            total +
            question.score,
          0,
        );

      return {
        totalMarks,

        obtainedMarks,

        answered:
          assessmentQuestions.filter(
            (question) =>
              question.status ===
              "answered",
          ).length,

        unanswered:
          assessmentQuestions.filter(
            (question) =>
              question.status ===
              "unanswered",
          ).length,

        needsReview:
          assessmentQuestions.filter(
            (question) =>
              question.status ===
              "review",
          ).length,

        unmatched:
          unmatchedAnswers.length,
      };
    }, [
      assessmentQuestions,
      unmatchedAnswers,
    ]);

  /*
   * ============================================================
   * QUESTION SELECT
   * ============================================================
   *
   * This is the important interaction:
   *
   * User clicks Question 3
   *        ↓
   * selectedId changes
   *        ↓
   * selectedQuestion changes
   *        ↓
   * AnswerSheetViewer receives Question 3
   *        ↓
   * Viewer gets Question 3's regions
   *        ↓
   * Viewer opens the correct PDF page
   *        ↓
   * Viewer scrolls to the mapped region
   */
  function handleQuestionSelect(
    id: string,
  ) {
    setSelectedId(id);

    /*
     * If the user previously selected
     * an unmatched answer, clear it.
     */
    setSelectedUnmatchedAnswer(
      null,
    );

    /*
     * On mobile, automatically show
     * the answer detail.
     */
    setMobileTab("answer");
  }

  /*
   * ============================================================
   * UNMATCHED ANSWER SELECT
   * ============================================================
   */
  function handleUnmatchedSelect(
    answer: UnmatchedAnswer,
  ) {
    setSelectedUnmatchedAnswer(
      answer,
    );

    setMobileTab("answer");
  }

  /*
   * ============================================================
   * MOBILE TAB
   * ============================================================
   */
  function handleMobileTabChange(
    tab: ReviewTab,
  ) {
    setMobileTab(tab);
  }

  /*
   * ============================================================
   * NO QUESTIONS
   * ============================================================
   */
  if (!selectedQuestion) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
        <div className="rounded-[16px] bg-[#fffdf8] p-8 text-center shadow-sm">
          <h1 className="text-[18px] font-bold text-[#34342f]">
            No questions
            extracted
          </h1>

          <p className="mt-2 text-[10px] text-[#99968c]">
            The question paper
            did not contain any
            questions that could
            be reviewed.
          </p>
        </div>
      </section>
    );
  }

  /*
   * ============================================================
   * REVIEW UI
   * ============================================================
   */
  return (
    <section className="h-[calc(100vh-64px)] overflow-hidden p-3 sm:p-5">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-[#fffdf8] shadow-[0_3px_15px_rgba(70,60,40,0.05)]">
        {/* =====================================================
            HEADER
            ===================================================== */}
        <AssessmentHeader
          total={
            assessmentQuestions.length
          }
          answered={
            summary.answered
          }
          unanswered={
            summary.unanswered
          }
          review={
            summary.needsReview
          }
        />

        {/* =====================================================
            MOBILE TABS
            ===================================================== */}
        <ReviewMobileTabs
          activeTab={
            mobileTab
          }
          onChange={
            handleMobileTabChange
          }
        />

        {/* =====================================================
            THREE COLUMN REVIEW
            ===================================================== */}
        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[280px_minmax(320px,1fr)_minmax(380px,1.15fr)]">
          {/* ===================================================
              LEFT SIDE
              QUESTIONS
              =================================================== */}
          <div
            className={[
              "min-h-0 overflow-hidden",

              mobileTab ===
              "questions"
                ? "block"
                : "hidden",

              "lg:block",
            ].join(" ")}
          >
            <AssessmentSummary
              summary={
                summary
              }
            />

            <div className="h-[calc(100%-145px)] overflow-y-auto">
              <QuestionList
                questions={
                  assessmentQuestions
                }
                unmatchedAnswers={
                  unmatchedAnswers
                }
                selectedId={
                  selectedId
                }
                onSelect={
                  handleQuestionSelect
                }
                onSelectUnmatched={
                  handleUnmatchedSelect
                }
              />
            </div>
          </div>

          {/* ===================================================
              MIDDLE
              QUESTION / ANSWER DETAIL
              =================================================== */}
          <div
            className={[
              "min-h-0 overflow-hidden",

              mobileTab ===
              "answer"
                ? "block"
                : "hidden",

              "lg:block",
            ].join(" ")}
          >
            {selectedUnmatchedAnswer ? (
              <UnmatchedAnswerDetail
                answer={
                  selectedUnmatchedAnswer
                }
              />
            ) : (
              <QuestionDetail
                question={
                  selectedQuestion
                }
                showOverallFeedback={
                  false
                }
              />
            )}
          </div>

          {/* ===================================================
              RIGHT
              ORIGINAL ANSWER SHEET
              =================================================== */}
          <div
            className={[
              "min-h-0 overflow-hidden",

              mobileTab ===
              "sheet"
                ? "block"
                : "hidden",

              "lg:block",
            ].join(" ")}
          >
            {answerSheetFile ? (
              <AnswerSheetViewer
                question={
                  selectedQuestion
                }
                unmatchedAnswer={
                  selectedUnmatchedAnswer
                }
                answerSheetFile={
                  answerSheetFile
                }
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#e8e4db]">
                <p className="text-[9px] text-[#77746c]">
                  Answer sheet is
                  not available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * ============================================================
 * UNMATCHED ANSWER DETAIL
 * ============================================================
 */
function UnmatchedAnswerDetail({
  answer,
}: {
  answer: UnmatchedAnswer;
}) {
  return (
    <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
      <span className="rounded-full bg-[#f8ddd4] px-3 py-1.5 text-[8px] font-semibold text-[#a45138]">
        Unmatched Answer
      </span>

      <h2 className="mt-5 text-[16px] font-bold leading-6 text-[#34342f]">
        Answer could not be
        mapped
      </h2>

      <p className="mt-2 text-[9px] leading-5 text-[#99968c]">
        This response was
        detected on page{" "}
        {answer.page}, but the
        system could not
        confidently associate
        it with a question.
      </p>

      <div className="mt-6 rounded-[12px] bg-[#fff8f3] p-4">
        <p className="text-[10px] leading-6 text-[#6f5f58]">
          {answer.text}
        </p>
      </div>

      <div className="mt-5 rounded-[12px] border border-[#eee5dc] p-4">
        <p className="text-[8px] font-semibold text-[#99968c]">
          Mapping confidence
        </p>

        <p className="mt-1 text-[18px] font-bold text-[#c85d3e]">
          {Math.round(
            answer.confidence *
              100,
          )}
          %
        </p>

        <p className="mt-1 text-[8px] leading-4 text-[#aaa69d]">
          A teacher should review
          this response manually.
        </p>
      </div>
    </div>
  );
}