import type {
  DocumentKind,
  SupportedFileType,
} from "@/types/document";

export const MAX_DOCUMENT_FILE_SIZE =
  10 * 1024 * 1024;

export const SUPPORTED_DOCUMENT_TYPES: SupportedFileType[] =
  [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

export type DocumentValidationError =
  | "invalid-type"
  | "too-large"
  | "empty-file";

export type DocumentValidationResult =
  | {
      valid: true;
      type: SupportedFileType;
    }
  | {
      valid: false;
      error: DocumentValidationError;
    };

export function validateDocumentFile(
  file: File,
  _kind: DocumentKind,
): DocumentValidationResult {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: "empty-file",
    };
  }

  if (
    !SUPPORTED_DOCUMENT_TYPES.includes(
      file.type as SupportedFileType,
    )
  ) {
    return {
      valid: false,
      error: "invalid-type",
    };
  }

  if (
    file.size > MAX_DOCUMENT_FILE_SIZE
  ) {
    return {
      valid: false,
      error: "too-large",
    };
  }

  return {
    valid: true,
    type: file.type as SupportedFileType,
  };
}