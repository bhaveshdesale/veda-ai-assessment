import type {
  DocumentKind,
  NormalizedDocument,
  SupportedFileType,
} from "@/types/document";

type NormalizeDocumentInput = {
  id: string;
  kind: DocumentKind;
  file: File;
  fileType: SupportedFileType;
};

export function normalizeDocument({
  id,
  kind,
  file,
  fileType,
}: NormalizeDocumentInput): NormalizedDocument {
  return {
    id,
    kind,
    source: {
      id,
      kind,
      fileName: file.name,
      fileType,
      fileSize: file.size,
    },
    pages: [],
  };
}