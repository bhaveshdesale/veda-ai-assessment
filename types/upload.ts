export type UploadFile = {
  file: File;
  name: string;
  size: string;
  type: string;
};

export type UploadError =
  | "invalid-type"
  | "too-large"
  | "read-error";

export type UploadState = {
  file: UploadFile | null;
  error: UploadError | null;
};