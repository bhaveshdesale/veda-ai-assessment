import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "./constants";
import type {
  UploadError,
  UploadFile,
} from "@/types/upload";

export function validateUpload(
  file: File,
): UploadError | null {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "invalid-type";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "too-large";
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

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}