"use client";
import { ChevronRight, Clock, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { Guide } from "../types";

interface GuideCardProps {
  guide: Guide;
  onSelectGuide: (guide: Guide) => void;
  onRestartGuide?: (guideId: string) => void;
}

export function GuideCard({ guide, onSelectGuide, onRestartGuide }: GuideCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const completedSteps = guide.completedSteps.length;
  const totalSteps = guide.steps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const difficultyColors = {
    beginner:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/20",
    intermediate:
      "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-amber-500/20",
    advanced: "bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/20",
  };

  const maxTags = isMobile ? 2 : 3;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectGuide(guide);
    }
  };

  return (
    <div
      onClick={() => onSelectGuide(guide)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group relative flex h-full min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/40 hover:from-gray-800/80 hover:to-gray-900/80 hover:shadow-indigo-500/10 hover:shadow-xl sm:min-h-[340px]"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header content */}
      <div className="relative mb-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex-shrink-0 rounded-lg border px-3 py-1.5 font-semibold text-xs uppercase tracking-wide shadow-sm ${difficultyColors[guide.difficulty]}`}
            >
              {guide.difficulty}
            </span>
            {progressPercentage > 0 && onRestartGuide && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestartGuide(guide.id);
                }}
                className="flex items-center gap-1 rounded-lg bg-gray-700/60 px-2 py-1 text-gray-300 text-xs transition-colors duration-200 hover:bg-gray-600/60 hover:text-white"
                title="Restart guide"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Restart</span>
              </button>
            )}
          </div>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-indigo-400" />
        </div>
        <div className="space-y-3">
          <h3 className="line-clamp-2 font-semibold text-lg text-white transition-colors group-hover:text-indigo-300 sm:text-xl">
            {guide.title}
          </h3>
          <p className="line-clamp-3 text-gray-300 text-sm leading-relaxed sm:text-base">
            {guide.description}
          </p>
        </div>
      </div>

      {/* Flexible spacer */}
      <div className="min-h-[1rem] flex-1"></div>

      {/* Bottom content - always at bottom */}
      <div className="relative mt-auto space-y-5">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-300 text-sm">Progress</span>
            <span className="font-medium text-gray-400 text-xs">
              {completedSteps}/{totalSteps} steps completed
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            {progressPercentage > 0 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20" />
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {guide.tags.slice(0, maxTags).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-lg bg-gray-700/60 px-2.5 py-1.5 font-medium text-gray-300 text-xs transition-colors duration-200 hover:bg-gray-600/60"
            >
              #{tag}
            </span>
          ))}
          {guide.tags.length > maxTags && (
            <span className="inline-flex items-center rounded-lg bg-gray-700/40 px-2.5 py-1.5 font-medium text-gray-400 text-xs">
              +{guide.tags.length - maxTags} more
            </span>
          )}
        </div>

        {/* Meta info footer */}
        <div className="border-gray-700/30 border-t pt-4">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0 text-indigo-400" />
              <span className="font-medium text-white">{guide.estimatedTime}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="truncate text-gray-400">{guide.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
