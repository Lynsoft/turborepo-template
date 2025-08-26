"use client";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  GitBranch,
  Lock,
  Terminal,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Guide, Step } from "../types";
import { GuideSuggestionModal } from "./GuideSuggestionModal";
import { GuideSuggestions } from "./GuideSuggestions";
import { RelatedGuides } from "./RelatedGuides";

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

interface GuideDetailProps {
  guide: Guide;
  onBack: () => void;
  onStepToggle: (stepId: string) => void;
  onCreateLinkedGuide?: (
    stepId: string,
    guideData: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    }
  ) => void;
  onEditGuide?: () => void;
  allGuides?: Guide[];
  onSelectGuide?: (guide: Guide) => void;
  onGenerateGuideFromSuggestion?: (suggestion: GuideSuggestion) => void;
}

export function GuideDetail({
  guide,
  onBack,
  onStepToggle,
  onCreateLinkedGuide,
  onEditGuide,
  allGuides = [],
  onSelectGuide,
  onGenerateGuideFromSuggestion,
}: GuideDetailProps) {
  const [copiedSteps, setCopiedSteps] = useState<Set<string>>(new Set());
  const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedSuggestion, setSelectedSuggestion] = useState<GuideSuggestion | null>(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isGeneratingFromSuggestion, setIsGeneratingFromSuggestion] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const completedSteps = guide.completedSteps.length;
  const totalSteps = guide.steps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Check if a step can be completed (all previous steps must be completed)
  const canCompleteStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true; // First step can always be completed

    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      const previousStep = guide.steps[i];
      if (!guide.completedSteps.includes(previousStep.id)) {
        return false;
      }
    }
    return true;
  };

  // Enhanced step toggle with validation and auto-scroll
  const handleStepToggle = (stepId: string, stepIndex: number) => {
    const isCompleted = guide.completedSteps.includes(stepId);

    // If trying to complete a step, check if previous steps are done
    if (!isCompleted && !canCompleteStep(stepIndex)) {
      return; // Prevent completion if previous steps aren't done
    }

    // Call the original toggle function
    onStepToggle(stepId);

    // If completing a step (not uncompleting), scroll to next step
    if (!isCompleted && stepIndex < guide.steps.length - 1) {
      setTimeout(() => {
        const nextStepId = guide.steps[stepIndex + 1].id;
        const nextStepElement = stepRefs.current[nextStepId];
        if (nextStepElement) {
          nextStepElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 300); // Small delay to allow state update
    }
  };

  const getStepIcon = (step: Step) => {
    switch (step.type) {
      case "command":
        return <Terminal className="h-4 w-4" />;
      case "verification":
        return <CheckCircle className="h-4 w-4" />;
      case "note":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStepTypeColor = (type: Step["type"]) => {
    switch (type) {
      case "command":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "verification":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "note":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps((prev) => new Set(prev).add(stepId));
    setTimeout(() => {
      setCopiedSteps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });
    }, 2000);
  };

  const handleGenerateGuide = (step: Step) => {
    if (step.suggestedGuide && onCreateLinkedGuide) {
      onCreateLinkedGuide(step.id, step.suggestedGuide);
    }
  };

  const handleSuggestionClick = (suggestion: GuideSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsSuggestionModalOpen(true);
  };

  const handleConfirmSuggestion = async (suggestion: GuideSuggestion) => {
    if (!onGenerateGuideFromSuggestion) return;

    setIsGeneratingFromSuggestion(true);
    try {
      await onGenerateGuideFromSuggestion(suggestion);
      setIsSuggestionModalOpen(false);
      setSelectedSuggestion(null);
    } finally {
      setIsGeneratingFromSuggestion(false);
    }
  };

  const handleCloseSuggestionModal = () => {
    if (isGeneratingFromSuggestion) return; // Prevent closing while generating
    setIsSuggestionModalOpen(false);
    setSelectedSuggestion(null);
  };

  // Get current step for suggestions (first incomplete step or last step if all complete)
  const getCurrentStep = () => {
    const firstIncompleteIndex = guide.steps.findIndex(
      (step) => !guide.completedSteps.includes(step.id)
    );
    return firstIncompleteIndex !== -1 ? firstIncompleteIndex : guide.steps.length - 1;
  };

  const currentStepIndex = getCurrentStep();
  const currentStep = guide.steps[currentStepIndex];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 text-sm transition-colors hover:text-white sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to guides</span>
          </button>

          {onEditGuide && (
            <button
              type="button"
              onClick={onEditGuide}
              className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Guide</span>
            </button>
          )}
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm sm:p-6">
          <h1 className="mb-3 font-bold text-white text-xl sm:text-2xl">
            {guide.title}
          </h1>
          <p className="mb-4 text-gray-300 text-sm leading-relaxed sm:text-base">
            {guide.description}
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Progress</span>
              <span className="flex-shrink-0 text-gray-400 text-sm">
                {completedSteps}/{totalSteps} completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700 sm:h-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 sm:h-3"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Meta info */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-gray-400 text-sm sm:gap-6">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{guide.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{guide.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(guide.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="flex-shrink-0 rounded bg-indigo-600 px-2 py-1 text-white text-xs">
              {guide.difficulty}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-700 px-2 py-1 text-gray-300 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-white sm:text-xl">
            Steps
          </h2>
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
            <Lock className="h-3 w-3" />
            <span>Complete steps in order</span>
          </div>
        </div>
        {guide.steps.map((step, index) => {
          const isCompleted = guide.completedSteps.includes(step.id);
          const canComplete = canCompleteStep(index);
          const isDisabled = !isCompleted && !canComplete;

          return (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[step.id] = el;
              }}
              className={`relative rounded-xl border bg-gray-800/50 p-4 backdrop-blur-sm transition-all duration-300 sm:p-6 ${
                isCompleted
                  ? "border-green-500/50 bg-green-500/5"
                  : isDisabled
                  ? "border-gray-700/50 bg-gray-800/30 opacity-60"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              {/* Step Actions - Top Right */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {step.docUrl && (
                  <a
                    href={step.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-indigo-500/30 bg-indigo-600/20 p-2 text-indigo-300 transition-colors duration-200 hover:bg-indigo-600/30 hover:text-indigo-200"
                    title="View Documentation"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {step.suggestedGuide && onCreateLinkedGuide && (
                  <button
                    type="button"
                    onClick={() => handleGenerateGuide(step)}
                    className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-2 text-purple-300 transition-all duration-200 hover:from-purple-600/30 hover:to-indigo-600/30 hover:text-purple-200"
                    title={`Create "${step.suggestedGuide.title}" Guide`}
                  >
                    <GitBranch className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-start space-x-3 pr-16 sm:space-x-4">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStepToggle(step.id, index)}
                    disabled={isDisabled}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 sm:h-8 sm:w-8 ${
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    title={
                      isDisabled
                        ? "Complete previous steps first"
                        : isCompleted
                        ? "Mark as incomplete"
                        : "Mark as complete"
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-400 sm:h-6 sm:w-6" />
                    ) : (
                      <Circle
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          isDisabled
                            ? "text-gray-600"
                            : "text-gray-400 hover:text-white"
                        }`}
                      />
                    )}
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1">
                      <span className={`font-medium text-sm ${
                        isDisabled ? "text-gray-600" : "text-gray-400"
                      }`}>
                        Step {index + 1}
                      </span>
                      {isDisabled && (
                        <Lock className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <span
                      className={`flex-shrink-0 rounded border px-2 py-1 text-xs ${getStepTypeColor(step.type)} ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStepIcon(step)}
                        <span className="capitalize">{step.type}</span>
                      </div>
                    </span>
                  </div>

                  <h3 className={`mb-2 font-semibold text-base sm:text-lg ${
                    isDisabled ? "text-gray-500" : "text-white"
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`mb-4 text-sm leading-relaxed sm:text-base ${
                    isDisabled ? "text-gray-500" : "text-gray-300"
                  }`}>
                    {step.description}
                  </p>

                  {step.code && (
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-200 text-xs sm:p-4 sm:text-sm">
                        <code>{step.code}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={() =>
                          step.code && copyToClipboard(step.code, step.id)
                        }
                        className="absolute top-2 right-2 rounded bg-gray-800 p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-700 hover:text-white sm:p-2"
                        title={
                          copiedSteps.has(step.id)
                            ? "Copied!"
                            : "Copy to clipboard"
                        }
                      >
                        {copiedSteps.has(step.id) ? (
                          <Check className="h-3 w-3 text-green-400 sm:h-4 sm:w-4" />
                        ) : (
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Guide Suggestions - Show for current step only */}
              {index === currentStepIndex && currentStep && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <GuideSuggestions
                    currentGuide={guide}
                    currentStep={currentStep}
                    stepIndex={currentStepIndex}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

          {/* Completion Message */}
          {progressPercentage === 100 && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 text-center sm:mt-8 sm:p-6">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-400 sm:h-12 sm:w-12" />
              <h3 className="mb-2 font-semibold text-base text-white sm:text-lg">
                Guide Completed!
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Congratulations! You've successfully completed all steps in this
                guide.
              </p>
            </div>
          )}
        </div>

        {/* Related Guides Sidebar */}
        {onSelectGuide && (
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-left transition-colors hover:border-gray-600 lg:hidden"
            >
              <span className="font-medium text-white">Related Guides</span>
              <div className={`transform transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Toggle Related Guides</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Sidebar Content */}
            <div className={`lg:block ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
              <div className="lg:sticky lg:top-6">
                <RelatedGuides
                  currentGuide={guide}
                  allGuides={allGuides}
                  onSelectGuide={onSelectGuide}
                  className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guide Suggestion Modal */}
      <GuideSuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={handleCloseSuggestionModal}
        suggestion={selectedSuggestion}
        onConfirm={handleConfirmSuggestion}
        isGenerating={isGeneratingFromSuggestion}
      />
    </div>
  );
}
