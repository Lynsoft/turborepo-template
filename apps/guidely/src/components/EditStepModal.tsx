"use client";

import { X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useState } from "react";
import type { Step } from "../types";

interface EditStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (step: Step) => void;
  step: Step | null;
}

export function EditStepModal({
  isOpen,
  onClose,
  onSave,
  step,
}: EditStepModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const typeId = useId();
  const codeId = useId();
  const docUrlId = useId();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    docUrl: "",
    type: "action" as Step["type"],
  });

  useEffect(() => {
    if (step && isOpen) {
      setFormData({
        title: step.title,
        description: step.description,
        code: step.code || "",
        docUrl: step.docUrl || "",
        type: step.type,
      });
    }
  }, [step, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step) return;

    const updatedStep: Step = {
      ...step,
      ...formData,
      code: formData.code || undefined,
      docUrl: formData.docUrl || undefined,
    };

    onSave(updatedStep);
    onClose();
  };

  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between border-gray-700 border-b p-6">
          <h2 className="font-semibold text-white text-xl">Edit Step</h2>
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

          <div>
            <label
              htmlFor={typeId}
              className="mb-2 block font-medium text-gray-300 text-sm"
            >
              Type
            </label>
            <select
              id={typeId}
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as Step["type"],
                }))
              }
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="action">Action</option>
              <option value="command">Command</option>
              <option value="verification">Verification</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div>
            <label
              htmlFor={codeId}
              className="mb-2 block font-medium text-gray-300 text-sm"
            >
              Code (optional)
            </label>
            <textarea
              id={codeId}
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              rows={4}
              placeholder="Enter code snippet if applicable"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 font-mono text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor={docUrlId}
              className="mb-2 block font-medium text-gray-300 text-sm"
            >
              Documentation URL (optional)
            </label>
            <input
              id={docUrlId}
              type="url"
              value={formData.docUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, docUrl: e.target.value }))
              }
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
