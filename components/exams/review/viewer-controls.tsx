"use client";

import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

type ViewerControlsProps = {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
};

export function ViewerControls({
  currentPage,
  totalPages,
  zoom,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ViewerControlsProps) {
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-[#45463f] bg-[#343530] px-3 py-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canPrevious}
          onClick={onPreviousPage}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#d7d5cf] transition-colors hover:bg-[#4a4b44] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={13} />
        </button>

        <span className="min-w-[65px] text-center text-[8px] font-medium text-[#d7d5cf]">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={!canNext}
          onClick={onNextPage}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#d7d5cf] transition-colors hover:bg-[#4a4b44] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={zoom <= 70}
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#d7d5cf] transition-colors hover:bg-[#4a4b44] disabled:opacity-30"
        >
          <Minus size={12} />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          className="flex h-7 min-w-[48px] items-center justify-center gap-1 rounded-md px-1 text-[8px] font-medium text-[#d7d5cf] hover:bg-[#4a4b44]"
          title="Reset zoom"
        >
          <RotateCcw size={10} />
          {zoom}%
        </button>

        <button
          type="button"
          disabled={zoom >= 150}
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#d7d5cf] transition-colors hover:bg-[#4a4b44] disabled:opacity-30"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}