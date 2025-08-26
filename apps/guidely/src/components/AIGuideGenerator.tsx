"use client";
import {
  AlertCircle,
  Bot,
  CheckCircle,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useId, useState } from "react";
import type { Guide } from "../types";

interface AIGuideGeneratorProps {
  onGenerateGuide: (
    guide: Omit<Guide, "id" | "createdAt" | "updatedAt" | "completedSteps">
  ) => void;
}

export function AIGuideGenerator({ onGenerateGuide }: AIGuideGeneratorProps) {
  const promptId = useId();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateGuide = async () => {
    if (!prompt.trim()) {
      setError("Please describe what guide you want to create.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate guide");
      }

      const data = await response.json();
      const { guide } = data;

      if (!guide) {
        throw new Error("No guide data received");
      }

      onGenerateGuide(guide);
      setSuccess(true);
      setPrompt("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate guide");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6">
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-lg bg-indigo-500/20 p-2">
          <Bot className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            AI Guide Generator
          </h3>
          <p className="text-gray-400 text-sm">
            Describe your guide and let AI create it for you
          </p>
        </div>
        <div className="flex-1"></div>
        <Sparkles className="h-5 w-5 text-purple-400" />
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={promptId}
            className="mb-2 block font-medium text-gray-300 text-sm"
          >
            Describe your guide
          </label>
          <textarea
            id={promptId}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Example: Create a guide for setting up a PostgreSQL database with Docker, including backup and restore procedures..."
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <p className="text-green-200 text-sm">
                Guide generated successfully!
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={generateGuide}
          disabled={isGenerating || !prompt.trim()}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Guide...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate Guide with AI</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-gray-500 text-xs">
        <p>
          💡 <strong>Tips:</strong> Be specific about technologies, steps, and
          desired outcomes. The more detail you provide, the better the
          generated guide will be.
        </p>
      </div>
    </div>
  );
}
