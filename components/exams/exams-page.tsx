// "use client";

// import { useState } from "react";
// import { UploadPage } from "./upload/upload-page";
// import { ProcessingPage } from "./processing/processing-page";
// import { AssessmentPage } from "./review/assessment-page";

// type ExamStage = "upload" | "processing" | "review";

// export function ExamsPage() {
//   const [stage, setStage] = useState<ExamStage>("upload");

//   function handleStartMapping() {
//     setStage("processing");
//   }

//   function handleProcessingComplete() {
//     setStage("review");
//   }

//   if (stage === "processing") {
//     return (
//       <ProcessingPage
//         onComplete={handleProcessingComplete}
//       />
//     );
//   }

//   if (stage === "review") {
//     return <AssessmentPage />;
//   }

//   return (
//     <UploadPage
//       onStartMapping={handleStartMapping}
//     />
//   );
// }


"use client";

import { useState } from "react";

import { ProcessingPage } from "./processing/processing-page";
import { AssessmentPage } from "./review/assessment-page";
import { UploadPage } from "./upload/upload-page";

type ExamStage =
  | "upload"
  | "processing"
  | "review";

export function ExamsPage() {
  const [stage, setStage] =
    useState<ExamStage>("upload");

  function handleStartMapping() {
    setStage("processing");
  }

  function handleProcessingComplete() {
    setStage("review");
  }

  switch (stage) {
    case "processing":
      return (
        <ProcessingPage
          onComplete={
            handleProcessingComplete
          }
        />
      );

    case "review":
      return <AssessmentPage />;

    case "upload":
    default:
      return (
        <UploadPage
          onStartMapping={handleStartMapping}
        />
      );
  }
}