export type SupportedFileType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png";

export type DocumentKind =
  | "question-paper"
  | "answer-sheet";

export type DocumentSource = {
  id: string;
  kind: DocumentKind;
  fileName: string;
  fileType: SupportedFileType;
  fileSize: number;
};

export type DocumentPage = {
  documentId: string;
  pageNumber: number;
  width: number;
  height: number;
  imageUrl: string;
};

export type NormalizedDocument = {
  id: string;
  kind: DocumentKind;
  source: DocumentSource;
  pages: DocumentPage[];
};