"use client";

import { useMemo, useState } from "react";
import { categories, sampleGuides, tags } from "@/data/sampleData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Guide } from "@/types";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { CreateGuideModal } from "./CreateGuideModal";
import { EditGuideModal } from "./EditGuideModal";
import { GuideDetail } from "./GuideDetail";
import { GuideGrid } from "./GuideGrid";
import { Header } from "./Header";
import { SearchModal } from "./SearchModal";
import { Sidebar } from "./Sidebar";
import { Stats } from "./Stats";

export function GuidelyApp() {
  const [guides, setGuides, isGuidesLoaded] = useLocalStorage<Guide[]>(
    "devguides-guides",
    sampleGuides
  );
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory =
        !selectedCategory || guide.category === selectedCategory;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => guide.tags.includes(tag));

      return matchesCategory && matchesTags;
    });
  }, [guides, selectedCategory, selectedTags]);

  const handleStepToggle = (stepId: string) => {
    if (!selectedGuide) return;

    setGuides(
      guides.map((guide) => {
        if (guide.id === selectedGuide.id) {
          const isCompleted = guide.completedSteps.includes(stepId);
          const newCompletedSteps = isCompleted
            ? guide.completedSteps.filter((id) => id !== stepId)
            : [...guide.completedSteps, stepId];

          const updatedGuide = {
            ...guide,
            completedSteps: newCompletedSteps,
            updatedAt: new Date(),
          };

          setSelectedGuide(updatedGuide);
          return updatedGuide;
        }
        return guide;
      })
    );
  };

  const handleRestartGuide = (guideId: string) => {
    setGuides(
      guides.map((guide) => {
        if (guide.id === guideId) {
          const updatedGuide = {
            ...guide,
            completedSteps: [],
            updatedAt: new Date(),
          };

          // If this is the currently selected guide, update it too
          if (selectedGuide && selectedGuide.id === guideId) {
            setSelectedGuide(updatedGuide);
          }

          return updatedGuide;
        }
        return guide;
      })
    );
  };

  const handleCreateGuide = (
    newGuideData: Omit<
      Guide,
      "id" | "createdAt" | "updatedAt" | "completedSteps"
    >
  ) => {
    const newGuide: Guide = {
      ...newGuideData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completedSteps: [],
      linkedGuides: newGuideData.linkedGuides || [],
      parentGuides: [],
    };

    setGuides([newGuide, ...guides]);
    setIsCreateModalOpen(false); // Close modal after creating
  };

  const handleCreateLinkedGuide = (
    _stepId: string,
    guideData: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    }
  ) => {
    const newGuide: Guide = {
      title: guideData.title,
      description: guideData.description,
      category: guideData.category,
      tags: guideData.tags,
      difficulty: "intermediate" as const,
      estimatedTime: "20-30 minutes",
      author: "AI Assistant",
      steps: [
        {
          id: "step-1",
          title: "Getting Started",
          description: `This guide will help you with: ${guideData.description}`,
          type: "action" as const,
          isCompleted: false,
        },
      ],
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completedSteps: [],
      linkedGuides: [],
      parentGuides: selectedGuide ? [selectedGuide.id] : [],
    };

    // Add the new guide
    setGuides((prev) => [newGuide, ...prev]);

    // Update the current guide to link to the new guide
    if (selectedGuide) {
      setGuides((prev) =>
        prev.map((guide) => {
          if (guide.id === selectedGuide.id) {
            const updatedGuide = {
              ...guide,
              linkedGuides: [...(guide.linkedGuides || []), newGuide.id],
            };
            setSelectedGuide(updatedGuide);
            return updatedGuide;
          }
          return guide;
        })
      );
    }

    // Navigate to the new guide
    setSelectedGuide(newGuide);
  };

  const handleGenerateGuideFromSuggestion = async (suggestion: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedTime: string;
  }) => {
    try {
      // Generate the guide using the existing AI endpoint
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a detailed guide for: ${suggestion.title}. ${suggestion.description}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate guide`);
      }

      const data = await response.json();
      const { guide: generatedGuide } = data;

      if (!generatedGuide) {
        throw new Error("No guide data received from AI service");
      }

      // Validate the generated guide structure
      if (!generatedGuide.title || !generatedGuide.steps || !Array.isArray(generatedGuide.steps)) {
        throw new Error("Invalid guide structure received from AI service");
      }

      // Create the new guide with proper relationships
      const newGuide: Guide = {
        ...generatedGuide,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        completedSteps: [],
        linkedGuides: [],
        parentGuides: selectedGuide ? [selectedGuide.id] : [],
      };

      // Add the new guide
      setGuides((prev) => [newGuide, ...prev]);

      // Update the current guide to link to the new guide
      if (selectedGuide) {
        setGuides((prev) =>
          prev.map((guide) => {
            if (guide.id === selectedGuide.id) {
              const updatedGuide = {
                ...guide,
                linkedGuides: [...(guide.linkedGuides || []), newGuide.id],
              };
              setSelectedGuide(updatedGuide);
              return updatedGuide;
            }
            return guide;
          })
        );
      }

      // Navigate to the new guide
      setSelectedGuide(newGuide);
    } catch (error) {
      console.error("Error generating guide from suggestion:", error);

      // Re-throw the error so the modal can handle it
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while generating the guide");
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Guide editing
  const handleEditGuide = (updatedGuide: Guide) => {
    setGuides(
      guides.map((guide) =>
        guide.id === updatedGuide.id ? updatedGuide : guide
      )
    );
    if (selectedGuide && selectedGuide.id === updatedGuide.id) {
      setSelectedGuide(updatedGuide);
    }
  };

  // Modal management functions
  const openCreateModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const openEditModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(true);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useKeyboardShortcut(openSearchModal, {
    key: "k",
    metaKey: true,
    ctrlKey: true, // This will match either Cmd or Ctrl
  });

  // Show loading state until localStorage is loaded
  if (!isGuidesLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Main render with modals always available
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header
        onCreateGuide={openCreateModal}
        onToggleSidebar={toggleSidebar}
        onOpenSearch={openSearchModal}
      />

      {selectedGuide ? (
        <GuideDetail
          guide={selectedGuide}
          onBack={() => setSelectedGuide(null)}
          onStepToggle={handleStepToggle}
          onCreateLinkedGuide={handleCreateLinkedGuide}
          onEditGuide={openEditModal}
          allGuides={guides}
          onSelectGuide={setSelectedGuide}
          onGenerateGuideFromSuggestion={handleGenerateGuideFromSuggestion}
        />
      ) : (
        <div className="flex">
          <Sidebar
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onCategorySelect={setSelectedCategory}
            onTagToggle={handleTagToggle}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />

          <main className="min-w-0 flex-1 p-4 sm:p-6">
            <Stats guides={guides} />
            <GuideGrid
              guides={filteredGuides}
              onSelectGuide={setSelectedGuide}
              onRestartGuide={handleRestartGuide}
            />
          </main>
        </div>
      )}

      {/* Modals - always rendered */}
      <CreateGuideModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateGuide}
        categories={categories.map((c) => c.id)}
      />

      <EditGuideModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditGuide}
        guide={selectedGuide}
        categories={categories.map((c) => c.id)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        guides={guides}
        categories={categories}
        tags={tags}
        onSelectGuide={(guide) => {
          setSelectedGuide(guide);
          closeSearchModal();
        }}
        onSearchChange={() => {}} // Not used since search is handled internally
      />
    </div>
  );
}
