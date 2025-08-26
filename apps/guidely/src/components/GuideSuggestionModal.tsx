"use client";

import {
  AlertTriangle,
  Bot,
  Clock,
  Hash,
  Loader2,
  Sparkles,
  Tag,
  Wand2,
  X,
} from "lucide-react";
import { useState } from "react";

interface GuideSuggestion {
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  relevanceReason: string;
  priority: number;
}

interface GuideSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: GuideSuggestion | null;
  onConfirm: (suggestion: GuideSuggestion) => Promise<void>;
  isGenerating?: boolean;
}

export function GuideSuggestionModal({
  isOpen,
  onClose,
  suggestion,
  onConfirm,
  isGenerating = false,
}: GuideSuggestionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!suggestion) return;

    setIsConfirming(true);
    setError(null);

    try {
      await onConfirm(suggestion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate guide";
      setError(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    if (isConfirming || isGenerating) return;
    setError(null);
    onClose();
  };

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

  const getCategoryColor = (category: string) => {
    const colors = {
      database: "text-blue-400 bg-blue-400/10",
      deployment: "text-purple-400 bg-purple-400/10",
      development: "text-green-400 bg-green-400/10",
      devops: "text-orange-400 bg-orange-400/10",
      "ai-tools": "text-pink-400 bg-pink-400/10",
      frontend: "text-cyan-400 bg-cyan-400/10",
      backend: "text-indigo-400 bg-indigo-400/10",
      security: "text-red-400 bg-red-400/10",
    };
    return colors[category as keyof typeof colors] || "text-gray-400 bg-gray-400/10";
  };

  if (!isOpen || !suggestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-indigo-500/20 p-2">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">
                AI Guide Suggestion
              </h2>
              <p className="text-gray-400 text-sm">
                Create a new guide based on your current progress
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isConfirming || isGenerating}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Banner */}
          <div className="mb-6 flex items-start space-x-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
            <div>
              <p className="font-medium text-amber-200 text-sm">
                AI-Generated Guide
              </p>
              <p className="mt-1 text-amber-300/80 text-xs">
                This will create a new guide using AI. The content will be generated
                based on the suggestion below and may require review and editing.
              </p>
            </div>
          </div>

          {/* Suggestion Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-lg text-white">
                {suggestion.title}
              </h3>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-300 leading-relaxed">
                {suggestion.description}
              </p>
            </div>

            {/* Relevance Reason */}
            <div className="rounded-lg bg-indigo-500/10 p-4">
              <div className="flex items-start space-x-2">
                <Bot className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" />
                <div>
                  <p className="font-medium text-indigo-200 text-sm">
                    Why this is relevant:
                  </p>
                  <p className="mt-1 text-indigo-300/80 text-sm">
                    {suggestion.relevanceReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Category & Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getCategoryColor(
                      suggestion.category
                    )}`}
                  >
                    {suggestion.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-gray-400" />
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getDifficultyColor(
                      suggestion.difficulty
                    )}`}
                  >
                    {suggestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Time & Tags */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {suggestion.estimatedTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {suggestion.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-gray-700 px-2 py-1 text-gray-300 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {suggestion.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{suggestion.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="font-medium text-red-200 text-sm">
                    Generation Failed
                  </p>
                  <p className="mt-1 text-red-300/80 text-xs">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-700 p-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isConfirming || isGenerating}
            className="rounded-lg border border-gray-600 px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || isGenerating}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600"
          >
            {isConfirming || isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Guide...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Guide</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
