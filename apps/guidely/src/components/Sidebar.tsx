"use client";
import { Filter, Folder, Hash } from "lucide-react";
import type { Category, Tag } from "../types";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: string | null;
  selectedTags: string[];
  onCategorySelect: (categoryId: string | null) => void;
  onTagToggle: (tagId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategorySelect,
  onTagToggle,
  isOpen = true,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform border-gray-800 border-r bg-gray-900/30 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${!isOpen && "lg:translate-x-0"}flex flex-col`}
      >
        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 transition-colors hover:text-white lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Close sidebar</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Filters Header */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <h2 className="font-semibold text-lg text-white">Filters</h2>
            </div>

            {/* Categories */}
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <Folder className="h-4 w-4 text-gray-400" />
                <h3 className="font-medium text-gray-300 text-sm">
                  Categories
                </h3>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onCategorySelect(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                    selectedCategory === null
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="flex-shrink-0 rounded bg-gray-700 px-2 py-1 text-xs">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <h3 className="font-medium text-gray-300 text-sm">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => onTagToggle(tag.id)}
                    className={`rounded-full px-2 py-1 font-medium text-xs transition-colors duration-200 sm:px-3 ${
                      selectedTags.includes(tag.id)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || selectedTags.length > 0) && (
              <div>
                <h3 className="mb-3 font-medium text-gray-300 text-sm">
                  Active Filters
                </h3>
                <div className="space-y-2">
                  {selectedCategory && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2">
                      <span className="mr-2 truncate text-gray-300 text-xs">
                        Category:{" "}
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => onCategorySelect(null)}
                        className="flex-shrink-0 text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return (
                      <div
                        key={tagId}
                        className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2"
                      >
                        <span className="mr-2 truncate text-gray-300 text-xs">
                          #{tag?.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onTagToggle(tagId)}
                          className="flex-shrink-0 text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
