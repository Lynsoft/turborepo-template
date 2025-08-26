export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  steps: Step[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  completedSteps: string[];
  linkedGuides?: string[]; // Array of guide IDs that this guide links to
  parentGuides?: string[]; // Array of guide IDs that link to this guide
}

export interface Step {
  id: string;
  title: string;
  description: string;
  code?: string;
  docUrl?: string;
  type: "action" | "command" | "verification" | "note";
  isCompleted: boolean;
  suggestedGuide?: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}
