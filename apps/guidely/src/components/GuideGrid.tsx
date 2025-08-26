"use client";
import { BookOpen } from "lucide-react";
import type { Guide } from "../types";
import { GuideCard } from "./GuideCard";

interface GuideGridProps {
  guides: Guide[];
  onSelectGuide: (guide: Guide) => void;
  onRestartGuide?: (guideId: string) => void;
}

export function GuideGrid({ guides, onSelectGuide, onRestartGuide }: GuideGridProps) {
  if (guides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="mb-4 h-16 w-16 text-gray-500" />
        <h3 className="mb-2 font-semibold text-gray-400 text-xl">
          No guides found
        </h3>
        <p className="max-w-md text-center text-gray-500">
          Try adjusting your search or filters, or create a new guide to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          guide={guide}
          onSelectGuide={onSelectGuide}
          onRestartGuide={onRestartGuide}
        />
      ))}
    </div>
  );
}
