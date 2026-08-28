import type { DocumentPage } from "@/types/document";

type FetchDocumentPagesInput = {
  file: File;
  documentId: string;
};

type FetchDocumentPagesResult = {
  success?: boolean;
  documentPages?: DocumentPage[];
  error?: string;
};

export async function fetchDocumentPages({
  file,
  documentId,
}: FetchDocumentPagesInput): Promise<
  FetchDocumentPagesResult
> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  formData.append(
    "documentId",
    documentId,
  );

  /*
   * The API validates the MIME type,
   * so we must send it.
   */
  formData.append(
    "fileType",
    file.type,
  );

  const response =
    await fetch(
      "/api/documents/pages",
      {
        method: "POST",
        body: formData,
      },
    );

  const result =
    (await response.json()) as FetchDocumentPagesResult;

  if (!response.ok) {
    throw new Error(
      result.error ??
        "Failed to render document pages.",
    );
  }

  return result;
}