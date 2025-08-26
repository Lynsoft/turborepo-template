"use client";

import {
  ArrowRight,
  Bot,
  Clock,
  Hash,
  Lightbulb,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Guide, Step } from "../types";

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

interface GuideSuggestionsProps {
  currentGuide: Guide;
  currentStep: Step;
  stepIndex: number;
  onSuggestionClick: (suggestion: GuideSuggestion) => void;
  className?: string;
}

export function GuideSuggestions({
  currentGuide,
  currentStep,
  stepIndex,
  onSuggestionClick,
  className = "",
}: GuideSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<GuideSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Only show suggestions for AI-generated guides
  const isAIGenerated = currentGuide.author === "AI Assistant";

  const fetchSuggestions = async () => {
    if (!isAIGenerated || hasLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/suggest-guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentGuide: {
            title: currentGuide.title,
            description: currentGuide.description,
            category: currentGuide.category,
            tags: currentGuide.tags,
            difficulty: currentGuide.difficulty,
          },
          currentStep: {
            id: currentStep.id,
            title: currentStep.title,
            description: currentStep.description,
            type: currentStep.type,
            code: currentStep.code,
          },
          stepIndex,
          totalSteps: currentGuide.steps.length,
          completedSteps: currentGuide.completedSteps.length,
          userContext: {
            recentCategories: [currentGuide.category],
            preferredDifficulty: currentGuide.difficulty,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch suggestions when the component mounts or step changes
    fetchSuggestions();
  }, [currentStep.id, stepIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 9) return <Star className="h-3 w-3 text-yellow-400" />;
    if (priority >= 7) return <Lightbulb className="h-3 w-3 text-blue-400" />;
    return <Hash className="h-3 w-3 text-gray-400" />;
  };

  // Don't render anything if not an AI-generated guide
  if (!isAIGenerated) return null;

  // Don't render if no suggestions and not loading
  if (!isLoading && suggestions.length === 0 && !error) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="rounded-md bg-indigo-500/20 p-1.5">
          <Bot className="h-4 w-4 text-indigo-400" />
        </div>
        <h3 className="font-medium text-gray-200 text-sm">
          Suggested Next Guides
        </h3>
        <Sparkles className="h-3 w-3 text-purple-400" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/30 p-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Finding relevant guides...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-red-300 text-sm">
            Failed to load suggestions. Try refreshing the page.
          </p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="group w-full rounded-lg border border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-800/30 p-3 text-left transition-all duration-200 hover:border-indigo-500/50 hover:from-indigo-500/10 hover:to-purple-500/10 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  {/* Title and Priority */}
                  <div className="flex items-start space-x-2">
                    {getPriorityIcon(suggestion.priority)}
                    <h4 className="font-medium text-white text-sm leading-tight group-hover:text-indigo-200">
                      {suggestion.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {suggestion.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center space-x-1">
                      <Hash className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-400">{suggestion.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className={`h-2 w-2 rounded-full ${getDifficultyColor(suggestion.difficulty).replace('text-', 'bg-')}`} />
                      <span className={getDifficultyColor(suggestion.difficulty)}>
                        {suggestion.difficulty}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-400">{suggestion.estimatedTime}</span>
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-3 flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-indigo-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Subtle hint */}
      {suggestions.length > 0 && (
        <p className="text-center text-gray-500 text-xs">
          Click a suggestion to generate a new AI guide
        </p>
      )}
    </div>
  );
}
