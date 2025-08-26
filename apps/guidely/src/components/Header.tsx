"use client";

import { BookOpen, Menu, Plus, Search } from "lucide-react";

interface HeaderProps {
  onCreateGuide: () => void;
  onToggleSidebar?: () => void;
  onOpenSearch: () => void;
}

export function Header({
  onCreateGuide,
  onToggleSidebar,
  onOpenSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-gray-800 border-b bg-gray-900/50 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex min-w-0 items-center space-x-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 text-gray-400 transition-colors hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-white text-xl">DevGuides</h1>
              <p className="text-gray-400 text-xs">Developer Guide Hub</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-bold text-lg text-white">DevGuides</h1>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end space-x-2 sm:space-x-4">
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex max-w-xs flex-1 items-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-700 sm:max-w-sm lg:max-w-md"
            >
              <Search className="mr-3 h-4 w-4" />
              <span className="flex-1">Search...</span>
              <kbd className="hidden rounded border border-gray-600 px-1.5 py-0.5 font-mono text-xs text-gray-500 sm:inline-block">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={onCreateGuide}
              className="flex items-center space-x-1 whitespace-nowrap rounded-lg bg-indigo-600 px-2 py-2 font-medium text-sm text-white transition-colors duration-200 hover:bg-indigo-700 sm:space-x-2 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Guide</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
