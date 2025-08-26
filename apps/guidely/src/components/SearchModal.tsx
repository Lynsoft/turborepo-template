"use client";

import { Search, Clock, TrendingUp, Hash, BookOpen, X } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import type { Guide, Category, Tag } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  guides: Guide[];
  categories: Category[];
  tags: Tag[];
  onSelectGuide: (guide: Guide) => void;
  onSearchChange: (query: string) => void;
}

interface SearchResult {
  type: "guide" | "category" | "tag";
  item: Guide | Category | Tag;
  score: number;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

export function SearchModal({
  isOpen,
  onClose,
  guides,
  categories,
  tags,
  onSelectGuide,
  onSearchChange,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>(
    "guidely-recent-searches",
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // Open modal logic will be handled by parent component
        }
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search algorithm
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search guides
    guides.forEach((guide) => {
      let score = 0;
      const title = guide.title.toLowerCase();
      const description = guide.description.toLowerCase();
      const tags = guide.tags.join(" ").toLowerCase();

      // Title exact match gets highest score
      if (title.includes(searchTerm)) {
        score += title.startsWith(searchTerm) ? 100 : 80;
      }

      // Description match
      if (description.includes(searchTerm)) {
        score += 40;
      }

      // Tags match
      if (tags.includes(searchTerm)) {
        score += 60;
      }

      // Category match
      if (guide.category.toLowerCase().includes(searchTerm)) {
        score += 50;
      }

      if (score > 0) {
        results.push({ type: "guide", item: guide, score });
      }
    });

    // Search categories
    categories.forEach((category) => {
      const name = category.name.toLowerCase();
      if (name.includes(searchTerm)) {
        const score = name.startsWith(searchTerm) ? 90 : 70;
        results.push({ type: "category", item: category, score });
      }
    });

    // Search tags
    tags.forEach((tag) => {
      const name = tag.name.toLowerCase();
      if (name.includes(searchTerm)) {
        const score = name.startsWith(searchTerm) ? 85 : 65;
        results.push({ type: "tag", item: tag, score });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [query, guides, categories, tags]);

  // Get popular guides (most completed steps)
  const popularGuides = useMemo(() => {
    return guides
      .filter((guide) => guide.completedSteps.length > 0)
      .sort((a, b) => b.completedSteps.length - a.completedSteps.length)
      .slice(0, 5);
  }, [guides]);

  // Get recent guides (recently updated)
  const recentGuides = useMemo(() => {
    return guides
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [guides]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedIndex(0);
    onSearchChange(searchQuery);
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "guide") {
      onSelectGuide(result.item as Guide);
      addToRecentSearches(query);
      onClose();
    } else if (result.type === "category") {
      const categoryGuides = guides.filter(
        (guide) => guide.category === (result.item as Category).id
      );
      if (categoryGuides.length > 0) {
        onSelectGuide(categoryGuides[0]);
        addToRecentSearches(query);
        onClose();
      }
    } else if (result.type === "tag") {
      const tagGuides = guides.filter((guide) =>
        guide.tags.includes((result.item as Tag).id)
      );
      if (tagGuides.length > 0) {
        onSelectGuide(tagGuides[0]);
        addToRecentSearches(query);
        onClose();
      }
    }
  };

  const handleSelectGuide = (guide: Guide) => {
    onSelectGuide(guide);
    if (query.trim()) {
      addToRecentSearches(query);
    }
    onClose();
  };

  const addToRecentSearches = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const newSearch: RecentSearch = {
      query: searchQuery.trim(),
      timestamp: Date.now(),
    };

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((search) => search.query !== newSearch.query),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = searchResults.length;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalResults);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalResults) % totalResults);
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      e.preventDefault();
      handleSelectResult(searchResults[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-700 px-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search guides, categories, tags..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {query.trim() ? (
            // Search Results
            searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <SearchResultItem
                    key={`${result.type}-${(result.item as any).id}`}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={() => handleSelectResult(result)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No results found for "{query}"
              </div>
            )
          ) : (
            // Default suggestions
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    <Clock className="mr-2 h-3 w-3" />
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 3).map((search) => (
                    <button
                      key={search.query}
                      onClick={() => handleSearch(search.query)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-gray-300 hover:bg-gray-700"
                    >
                      <Search className="mr-3 h-4 w-4 text-gray-500" />
                      {search.query}
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Guides */}
              {popularGuides.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    <TrendingUp className="mr-2 h-3 w-3" />
                    Popular Guides
                  </div>
                  {popularGuides.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => handleSelectGuide(guide)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-gray-700"
                    >
                      <BookOpen className="mr-3 h-4 w-4 text-indigo-400" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-white">{guide.title}</div>
                        <div className="truncate text-xs text-gray-400">
                          {guide.completedSteps.length} steps completed
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Guides */}
              <div>
                <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  <Clock className="mr-2 h-3 w-3" />
                  Recently Updated
                </div>
                {recentGuides.slice(0, 3).map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => handleSelectGuide(guide)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-gray-700"
                  >
                    <BookOpen className="mr-3 h-4 w-4 text-green-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-white">{guide.title}</div>
                      <div className="truncate text-xs text-gray-400">
                        {guide.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="rounded border border-gray-600 px-1.5 py-0.5 text-xs">
                ⌘K
              </kbd>
              <span>to search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
  const { type, item } = result;

  const getIcon = () => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-4 w-4 text-indigo-400" />;
      case "category":
        return <Hash className="h-4 w-4 text-blue-400" />;
      case "tag":
        return <Hash className="h-4 w-4 text-green-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTitle = () => {
    if (type === "guide") return (item as Guide).title;
    return (item as Category | Tag).name;
  };

  const getSubtitle = () => {
    if (type === "guide") {
      const guide = item as Guide;
      return `${guide.category} • ${guide.steps.length} steps`;
    }
    if (type === "category") {
      const category = item as Category;
      return `${category.count} guides`;
    }
    if (type === "tag") {
      const tag = item as Tag;
      return `${tag.count} guides`;
    }
    return "";
  };

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors ${
        isSelected ? "bg-indigo-600" : "hover:bg-gray-700"
      }`}
    >
      <div className="mr-3">{getIcon()}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-white">{getTitle()}</div>
        <div className="truncate text-xs text-gray-400">{getSubtitle()}</div>
      </div>
      <div className="ml-2 text-xs text-gray-500 capitalize">{type}</div>
    </button>
  );
}
