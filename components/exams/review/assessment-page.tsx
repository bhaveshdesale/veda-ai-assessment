"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchDocumentPages } from "@/lib/documents";

import {
  buildAssessmentQuestions,
  buildUnmatchedAnswers,
} from "@/lib/assessment/adapter";

import type {
  UnmatchedAnswer,
} from "@/types/assessment";

import type {
  DocumentPage,
} from "@/types/document";

import type {
  AssessmentProcessingResult,
} from "@/types/processing";

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
  const {
    questions,
    answers,
    mappings,
  } = processingResult;

  const assessmentQuestions =
    useMemo(
      () =>
        buildAssessmentQuestions(
          questions,
          answers,
          mappings,
        ),
      [
        questions,
        answers,
        mappings,
      ],
    );

  const unmatchedAnswers =
    useMemo(
      () =>
        buildUnmatchedAnswers(
          answers,
          mappings,
        ),
      [
        answers,
        mappings,
      ],
    );

  const [
    documentPages,
    setDocumentPages,
  ] = useState<DocumentPage[]>([]);

  const [
    isLoadingDocumentPages,
    setIsLoadingDocumentPages,
  ] = useState(false);

  const [
    documentPageError,
    setDocumentPageError,
  ] = useState<string | null>(null);

  const [selectedId, setSelectedId] =
    useState("");

  const [
    selectedUnmatchedAnswer,
    setSelectedUnmatchedAnswer,
  ] = useState<UnmatchedAnswer | null>(
    null,
  );

  const [mobileTab, setMobileTab] =
    useState<ReviewTab>("questions");

  /*
   * Load answer-sheet document pages.
   */
  useEffect(() => {
    if (!answerSheetFile) {
      return;
    }

    let cancelled = false;

    async function loadDocumentPages() {
      try {
        setIsLoadingDocumentPages(true);
        setDocumentPageError(null);

        const result =
          await fetchDocumentPages({
            file: answerSheetFile!,
            documentId:
              "answer-sheet",
          });

        if (cancelled) {
          return;
        }

        setDocumentPages(
          result.documentPages ?? [],
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDocumentPageError(
          error instanceof Error
            ? error.message
            : "Failed to render answer sheet.",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingDocumentPages(
            false,
          );
        }
      }
    }

    void loadDocumentPages();

    return () => {
      cancelled = true;
    };
  }, [answerSheetFile]);

  /*
   * Select first question once the
   * extracted questions are available.
   */
  const activeSelectedId =
    selectedId ||
    assessmentQuestions[0]?.id ||
    "";

  const selectedQuestion =
    useMemo(
      () =>
        assessmentQuestions.find(
          (question) =>
            question.id ===
            activeSelectedId,
        ) ??
        assessmentQuestions[0] ??
        null,
      [
        assessmentQuestions,
        activeSelectedId,
      ],
    );

  /*
   * Assessment summary.
   */
  const summary = useMemo(() => {
    const totalMarks =
      assessmentQuestions.reduce(
        (total, question) =>
          total + question.marks,
        0,
      );

    const obtainedMarks =
      assessmentQuestions.reduce(
        (total, question) =>
          total + question.score,
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

  function handleQuestionSelect(
    id: string,
  ) {
    setSelectedId(id);
    setSelectedUnmatchedAnswer(null);
    setMobileTab("answer");
  }

  function handleUnmatchedSelect(
    answer: UnmatchedAnswer,
  ) {
    setSelectedUnmatchedAnswer(answer);
    setMobileTab("answer");
  }

  function handleMobileTabChange(
    tab: ReviewTab,
  ) {
    setMobileTab(tab);
  }

  if (!selectedQuestion) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
        <div className="rounded-[16px] bg-[#fffdf8] p-8 text-center shadow-sm">
          <h1 className="text-[18px] font-bold text-[#34342f]">
            No questions found
          </h1>

          <p className="mt-2 text-[10px] text-[#8b8981]">
            No questions could be extracted
            from the question paper.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-[calc(100vh-64px)] overflow-hidden p-3 sm:p-5">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-[#fffdf8] shadow-[0_3px_15px_rgba(70,60,40,0.05)]">
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

        <ReviewMobileTabs
          activeTab={mobileTab}
          onChange={
            handleMobileTabChange
          }
        />

        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[280px_minmax(320px,1fr)_minmax(380px,1.15fr)]">
          {/* Questions */}
          <div
            className={[
              "min-h-0 overflow-hidden",
              mobileTab === "questions"
                ? "block"
                : "hidden",
              "lg:block",
            ].join(" ")}
          >
            <AssessmentSummary
              summary={summary}
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
                  activeSelectedId
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

          {/* Question / Answer Detail */}
          <div
            className={[
              "min-h-0 overflow-hidden",
              mobileTab === "answer"
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

          {/* Answer Sheet */}
          <div
            className={[
              "min-h-0 overflow-hidden",
              mobileTab === "sheet"
                ? "block"
                : "hidden",
              "lg:block",
            ].join(" ")}
          >
            {isLoadingDocumentPages ? (
              <div className="flex h-full items-center justify-center bg-[#e8e4db]">
                <p className="text-[9px] text-[#77746c]">
                  Rendering answer sheet...
                </p>
              </div>
            ) : documentPageError ? (
              <div className="flex h-full items-center justify-center bg-[#e8e4db] p-6">
                <p className="text-center text-[9px] text-[#b56750]">
                  {documentPageError}
                </p>
              </div>
            ) : (
              <AnswerSheetViewer
                question={
                  selectedQuestion
                }
                unmatchedAnswer={
                  selectedUnmatchedAnswer
                }
                documentPages={
                  documentPages
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
        Answer could not be mapped
      </h2>

      <p className="mt-2 text-[9px] leading-5 text-[#99968c]">
        This response was detected on
        page {answer.page}, but the system
        could not confidently associate it
        with a question.
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
            answer.confidence * 100,
          )}
          %
        </p>

        <p className="mt-1 text-[8px] leading-4 text-[#aaa69d]">
          A teacher should review this
          response manually.
        </p>
      </div>
    </div>
  );
}