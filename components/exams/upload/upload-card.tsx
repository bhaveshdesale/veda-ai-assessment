"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  ACCEPTED_FILE_EXTENSIONS,
} from "@/lib/constants";
import {
  createUploadFile,
  validateUpload,
} from "@/lib/upload";
import type {
  UploadError,
  UploadFile,
} from "@/types/upload";

type UploadCardProps = {
  title: string;
  description: string;
  file: UploadFile | null;
  error: UploadError | null;
  onFileChange: (
    file: UploadFile | null,
    error: UploadError | null,
  ) => void;
};

const errorMessages: Record<
  UploadError,
  string
> = {
  "invalid-type":
    "Please upload a PDF, JPG, JPEG or PNG file.",
  "too-large":
    "The file is larger than the 10MB limit.",
  "read-error":
    "We couldn't read this file. Please try again.",
};

export function UploadCard({
  title,
  description,
  file,
  error,
  onFileChange,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(fileToUpload: File) {
    const validationError =
      validateUpload(fileToUpload);

    if (validationError) {
      onFileChange(null, validationError);
      return;
    }

    onFileChange(
      createUploadFile(fileToUpload),
      null,
    );
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    handleFile(selectedFile);

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLLabelElement>,
  ) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    handleFile(droppedFile);
  }

  function removeFile(
    event: React.MouseEvent,
  ) {
    event.preventDefault();
    event.stopPropagation();

    onFileChange(null, null);
  }

  return (
    <div className="rounded-[15px] bg-[#fffaf0] p-2">
      <label
        htmlFor={`${title}-upload`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          "relative flex min-h-[160px] cursor-pointer",
          "flex-col items-center justify-center rounded-[11px]",
          "border border-dashed px-5 text-center",
          "transition-all duration-150",
          isDragging
            ? "border-[#f15b32] bg-[#fff1ea]"
            : error
              ? "border-[#d98a70] bg-[#fff8f4]"
              : file
                ? "border-[#9ab18e] bg-[#f8fbf5]"
                : "border-[#d6d0c3] bg-[#fffdf8] hover:border-[#f15b32]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={`${title}-upload`}
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS}
          onChange={handleInputChange}
          className="sr-only"
        />

        {error ? (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#f8ddd4] text-[#c85d3e]">
              <AlertCircle size={17} />
            </div>

            <p className="mt-3 text-[10px] font-semibold text-[#a45138]">
              Upload failed
            </p>

            <p className="mt-1 max-w-[230px] text-[8px] leading-4 text-[#a98274]">
              {errorMessages[error]}
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-3 text-[8px] font-semibold text-[#f15b32]"
            >
              Choose another file
            </button>
          </>
        ) : file ? (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#e4eedf] text-[#6d8c63]">
              {file.type === "application/pdf" ? (
                <FileText size={17} />
              ) : (
                <ImageIcon size={17} />
              )}
            </div>

            <div className="mt-3 flex max-w-full items-center gap-2">
              <p className="max-w-[190px] truncate text-[10px] font-semibold text-[#494841]">
                {file.name}
              </p>

              <CheckCircle2
                size={12}
                className="shrink-0 text-[#6d8c63]"
              />
            </div>

            <p className="mt-1 text-[8px] text-[#99968c]">
              {file.size}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                className="text-[8px] font-semibold text-[#66645d] hover:text-[#f15b32]"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={removeFile}
                className="flex items-center gap-1 text-[8px] font-semibold text-[#b56750]"
              >
                <X size={10} />
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#f1eee6] text-[#77746c]">
              <Upload size={17} />
            </div>

            <p className="mt-3 text-[10px] font-semibold text-[#494841]">
              Upload{" "}
              <span className="text-[#f15b32]">
                {title}
              </span>
            </p>

            <p className="mt-1 text-[8px] text-[#aaa69d]">
              {description}
            </p>

            <p className="mt-1 text-[7px] text-[#b2afa6]">
              Drag & drop or click to browse
            </p>
          </>
        )}
      </label>
    </div>
  );
}