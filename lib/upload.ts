import { validateDocumentFile } from "@/lib/documents";

import type {
  UploadError,
  UploadFile,
} from "@/types/upload";

export function validateUpload(
  file: File,
  kind:
    | "question-paper"
    | "answer-sheet",
): UploadError | null {
  const result = validateDocumentFile(
    file,
    kind,
  );

  if (!result.valid) {
    switch (result.error) {
      case "invalid-type":
        return "invalid-type";

      case "too-large":
        return "too-large";

      case "empty-file":
        return "read-error";
    }
  }

  return null;
}

export function createUploadFile(
  file: File,
): UploadFile {
  return {
    file,
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
  };
}

export function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}