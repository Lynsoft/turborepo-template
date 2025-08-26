"use client";
import { Plus, Trash2, X } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import type { Guide, Step } from "../types";
import { AIGuideGenerator } from "./AIGuideGenerator";

interface CreateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    guide: Omit<Guide, "id" | "createdAt" | "updatedAt" | "completedSteps">
  ) => void;
  categories: string[];
}

export function CreateGuideModal({
  isOpen,
  onClose,
  onSave,
  categories,
}: CreateGuideModalProps) {
  const titleId = useId();
  const categoryId = useId();
  const descriptionId = useId();
  const tagsId = useId();
  const difficultyId = useId();
  const estimatedTimeId = useId();

  const [activeTab, setActiveTab] = useState<"manual" | "ai">("ai");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedTime: "",
    author: "DevGuides Team",
  });

  const [steps, setSteps] = useState<Omit<Step, "isCompleted">[]>([
    {
      id: "1",
      title: "",
      description: "",
      code: "",
      type: "action" as const,
    },
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        code: "",
        type: "action",
      },
    ]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const updateStep = (stepId: string, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processedSteps: Step[] = steps.map((step) => ({
      ...step,
      isCompleted: false,
    }));

    onSave({
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      steps: processedSteps,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      tags: "",
      difficulty: "beginner",
      estimatedTime: "",
      author: "DevGuides Team",
    });
    setSteps([
      {
        id: "1",
        title: "",
        description: "",
        code: "",
        type: "action",
      },
    ]);
    onClose();
  };

  const handleAIGenerate = (
    aiGuide: Omit<Guide, "id" | "createdAt" | "updatedAt" | "completedSteps">
  ) => {
    onSave(aiGuide);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gray-800">
        <div className="flex items-center justify-between border-gray-700 border-b p-4 sm:p-6">
          <h2 className="font-bold text-white text-xl sm:text-2xl">
            Create New Guide
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Tab Navigation */}
          <div className="mb-6 flex space-x-1 rounded-lg bg-gray-700/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "ai"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              AI Generator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("manual")}
              className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "manual"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Manual Creation
            </button>
          </div>

          {activeTab === "ai" ? (
            <AIGuideGenerator onGenerateGuide={handleAIGenerate} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={titleId}
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Guide Title
                  </label>
                  <input
                    id={titleId}
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                    placeholder="Enter guide title..."
                  />
                </div>

                <div>
                  <label
                    htmlFor={categoryId}
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Category
                  </label>
                  <select
                    id={categoryId}
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                  >
                    <option value="">Select category...</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={descriptionId}
                  className="mb-2 block font-medium text-gray-300 text-sm"
                >
                  Description
                </label>
                <textarea
                  id={descriptionId}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                  placeholder="Describe what this guide covers..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor={tagsId}
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Tags (comma-separated)
                  </label>
                  <input
                    id={tagsId}
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                    placeholder="docker, postgresql, backup"
                  />
                </div>

                <div>
                  <label
                    htmlFor={difficultyId}
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Difficulty
                  </label>
                  <select
                    id={difficultyId}
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as
                          | "beginner"
                          | "intermediate"
                          | "advanced",
                      })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={estimatedTimeId}
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Estimated Time
                  </label>
                  <input
                    id={estimatedTimeId}
                    type="text"
                    required
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedTime: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                    placeholder="10-15 minutes"
                  />
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <h3 className="block font-medium text-gray-300 text-sm">
                    Steps
                  </h3>
                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-2 py-1 text-white text-xs transition-colors hover:bg-indigo-700 sm:px-3 sm:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="rounded-lg border border-gray-600 bg-gray-700/50 p-3 sm:p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-medium text-gray-300 text-sm">
                          Step {index + 1}
                        </span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="text-red-400 transition-colors hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="mb-3 grid grid-cols-1 gap-3 sm:mb-4 sm:grid-cols-2 sm:gap-4">
                        <input
                          type="text"
                          required
                          value={step.title}
                          onChange={(e) =>
                            updateStep(step.id, "title", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                          placeholder="Step title..."
                        />
                        <select
                          value={step.type}
                          onChange={(e) =>
                            updateStep(step.id, "type", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                        >
                          <option value="action">Action</option>
                          <option value="command">Command</option>
                          <option value="verification">Verification</option>
                          <option value="note">Note</option>
                        </select>
                      </div>

                      <textarea
                        required
                        value={step.description}
                        onChange={(e) =>
                          updateStep(step.id, "description", e.target.value)
                        }
                        rows={2}
                        className="mb-3 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mb-4 sm:text-base"
                        placeholder="Step description..."
                      />

                      <input
                        type="url"
                        value={step.docUrl || ""}
                        onChange={(e) =>
                          updateStep(step.id, "docUrl", e.target.value)
                        }
                        className="mb-3 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mb-4 sm:text-base"
                        placeholder="Documentation URL (optional)..."
                      />

                      {(step.type === "command" ||
                        step.type === "verification") && (
                        <textarea
                          value={step.code}
                          onChange={(e) =>
                            updateStep(step.id, "code", e.target.value)
                          }
                          rows={2}
                          className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 font-mono text-gray-200 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter command or code snippet..."
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 border-gray-700 border-t pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-gray-400 text-sm transition-colors hover:text-white sm:px-4 sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-700 sm:px-6 sm:text-base"
                >
                  Create Guide
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
