"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  GitBranch,
  Hash,
  User,
} from "lucide-react";
import type { Guide } from "../types";

interface RelatedGuidesProps {
  currentGuide: Guide;
  allGuides: Guide[];
  onSelectGuide: (guide: Guide) => void;
  className?: string;
}

export function RelatedGuides({
  currentGuide,
  allGuides,
  onSelectGuide,
  className = "",
}: RelatedGuidesProps) {
  // Get linked guides (guides this guide links to)
  const linkedGuides = currentGuide.linkedGuides
    ? allGuides.filter((guide) => currentGuide.linkedGuides?.includes(guide.id))
    : [];

  // Get parent guides (guides that link to this guide)
  const parentGuides = currentGuide.parentGuides
    ? allGuides.filter((guide) => currentGuide.parentGuides?.includes(guide.id))
    : [];

  // Get related guides by category and tags (excluding current guide)
  const relatedByContent = allGuides
    .filter((guide) => {
      if (guide.id === currentGuide.id) return false;

      // Already included in linked or parent guides
      if (linkedGuides.some(g => g.id === guide.id)) return false;
      if (parentGuides.some(g => g.id === guide.id)) return false;

      // Same category or shared tags
      const sameCategory = guide.category === currentGuide.category;
      const sharedTags = guide.tags.some(tag => currentGuide.tags.includes(tag));

      return sameCategory || sharedTags;
    })
    .sort((a, b) => {
      // Prioritize by shared tags count, then by category match
      const aSharedTags = a.tags.filter(tag => currentGuide.tags.includes(tag)).length;
      const bSharedTags = b.tags.filter(tag => currentGuide.tags.includes(tag)).length;

      if (aSharedTags !== bSharedTags) return bSharedTags - aSharedTags;

      const aSameCategory = a.category === currentGuide.category ? 1 : 0;
      const bSameCategory = b.category === currentGuide.category ? 1 : 0;

      return bSameCategory - aSameCategory;
    })
    .slice(0, 3); // Limit to 3 related guides

  const hasAnyRelatedGuides = linkedGuides.length > 0 || parentGuides.length > 0 || relatedByContent.length > 0;

  if (!hasAnyRelatedGuides) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400 bg-green-400/10";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/10";
      case "advanced":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const GuideCard = ({ guide, relationshipType }: { guide: Guide; relationshipType: string }) => {
    const completedSteps = guide.completedSteps.length;
    const totalSteps = guide.steps.length;
    const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
      <button
        onClick={() => onSelectGuide(guide)}
        className="group relative w-full overflow-hidden rounded-xl border border-gray-700/60 bg-gray-800/40 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-600/80 hover:bg-gray-800/60 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="space-y-4">
          {/* Header with improved spacing */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-indigo-200">
                {guide.title}
              </h4>
              <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 transition-colors duration-200 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {relationshipType}
            </p>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
            {guide.description}
          </p>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs font-semibold tabular-nums text-gray-400">
                {completedSteps}/{totalSteps} steps
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700/60">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              {progressPercentage > 0 && (
                <div
                  className="absolute inset-y-0 left-0 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ width: `${progressPercentage}%` }}
                />
              )}
            </div>
          </div>

          {/* Enhanced Metadata with better visual hierarchy */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex min-w-0 items-center gap-1">
                <Hash className="h-3 w-3 flex-shrink-0 text-gray-500" />
                <span className="truncate text-xs text-gray-400">{guide.category}</span>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${getDifficultyColor(
                  guide.difficulty
                )}`}
              >
                {guide.difficulty}
              </span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium tabular-nums text-gray-400">{guide.estimatedTime}</span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header with enhanced styling */}
      <div className="flex items-center space-x-2 rounded-lg border border-gray-700/50 bg-gray-800/30 p-3 backdrop-blur-sm">
        <GitBranch className="h-5 w-5 text-indigo-400" />
        <h2 className="font-semibold text-lg text-white">Related Guides</h2>
        <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
          {(parentGuides.length + linkedGuides.length + relatedByContent.length)}
        </div>
      </div>

      {/* Parent Guides */}
      {parentGuides.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center space-x-2 font-medium text-gray-300 text-sm">
            <ArrowRight className="h-4 w-4 rotate-180 text-blue-400" />
            <span>Prerequisites & Parent Guides</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {parentGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                relationshipType="Parent guide"
              />
            ))}
          </div>
        </div>
      )}

      {/* Linked Guides */}
      {linkedGuides.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center space-x-2 font-medium text-gray-300 text-sm">
            <ArrowRight className="h-4 w-4 text-green-400" />
            <span>Follow-up & Linked Guides</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {linkedGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                relationshipType="Linked guide"
              />
            ))}
          </div>
        </div>
      )}

      {/* Related by Content */}
      {relatedByContent.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center space-x-2 font-medium text-gray-300 text-sm">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span>Similar Guides</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {relatedByContent.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                relationshipType="Similar content"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
