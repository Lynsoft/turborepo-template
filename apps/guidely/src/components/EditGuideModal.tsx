"use client";

import { X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useState } from "react";
import type { Guide } from "../types";

interface EditGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guide: Guide) => void;
  guide: Guide | null;
  categories: string[];
}

export function EditGuideModal({
  isOpen,
  onClose,
  onSave,
  guide,
  categories,
}: EditGuideModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const categoryId = useId();
  const difficultyId = useId();
  const estimatedTimeId = useId();
  const authorId = useId();
  const tagsId = useId();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedTime: "",
    author: "",
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (guide && isOpen) {
      setFormData({
        title: guide.title,
        description: guide.description,
        category: guide.category,
        tags: [...guide.tags],
        difficulty: guide.difficulty,
        estimatedTime: guide.estimatedTime,
        author: guide.author,
      });
    }
  }, [guide, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;

    const updatedGuide: Guide = {
      ...guide,
      ...formData,
      updatedAt: new Date(),
    };

    onSave(updatedGuide);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (!isOpen || !guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between border-gray-700 border-b p-6">
          <h2 className="font-semibold text-white text-xl">Edit Guide</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              htmlFor={titleId}
              className="mb-2 block font-medium text-gray-300 text-sm"
            >
              Title
            </label>
            <input
              id={titleId}
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={categoryId}
                className="mb-2 block font-medium text-gray-300 text-sm"
              >
                Category
              </label>
              <select
                id={categoryId}
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  }))
                }
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedTime: e.target.value,
                  }))
                }
                placeholder="e.g., 15-30 minutes"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor={authorId}
                className="mb-2 block font-medium text-gray-300 text-sm"
              >
                Author
              </label>
              <input
                id={authorId}
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={tagsId}
              className="mb-2 block font-medium text-gray-300 text-sm"
            >
              Tags
            </label>
            <div className="mb-2 flex gap-2">
              <input
                id={tagsId}
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag"
                className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-gray-300 text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-gray-700 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
