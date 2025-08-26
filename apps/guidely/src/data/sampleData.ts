import type { Category, Guide, Tag } from "../types";

export const categories: Category[] = [
  {
    id: "database",
    name: "Database",
    color: "bg-blue-500",
    icon: "Database",
    count: 5,
  },
  {
    id: "deployment",
    name: "Deployment",
    color: "bg-green-500",
    icon: "Rocket",
    count: 8,
  },
  {
    id: "development",
    name: "Development",
    color: "bg-purple-500",
    icon: "Code",
    count: 12,
  },
  {
    id: "devops",
    name: "DevOps",
    color: "bg-orange-500",
    icon: "Server",
    count: 6,
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    color: "bg-pink-500",
    icon: "Brain",
    count: 4,
  },
];

export const tags: Tag[] = [
  { id: "docker", name: "Docker", color: "bg-blue-600", count: 15 },
  { id: "postgresql", name: "PostgreSQL", color: "bg-blue-700", count: 8 },
  {
    id: "self-hosting",
    name: "Self-hosting",
    color: "bg-green-600",
    count: 10,
  },
  { id: "coolify", name: "Coolify", color: "bg-teal-600", count: 5 },
  { id: "dokploy", name: "Dokploy", color: "bg-indigo-600", count: 4 },
  { id: "vscode", name: "VSCode", color: "bg-blue-500", count: 7 },
  { id: "ai", name: "AI", color: "bg-pink-600", count: 6 },
  { id: "backup", name: "Backup", color: "bg-yellow-600", count: 3 },
];

export const sampleGuides: Guide[] = [
  {
    id: "1",
    title: "Restore SQL Dump to Self-hosted Database",
    description:
      "Complete guide to restore a PostgreSQL dump to your Dokploy or Coolify managed database with proper commands and verification steps.",
    category: "database",
    tags: ["postgresql", "docker", "dokploy", "coolify", "backup"],
    difficulty: "intermediate",
    estimatedTime: "15-30 minutes",
    author: "DevGuides Team",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    completedSteps: [],
    linkedGuides: [],
    parentGuides: [],
    steps: [
      {
        id: "step-1",
        title: "Prepare your dump file",
        description: "Ensure you have the SQL dump file ready and accessible",
        type: "action",
        isCompleted: false,
      },
      {
        id: "step-2",
        title: "Access your server",
        description: "SSH into your server where Dokploy/Coolify is running",
        code: "ssh user@your-server-ip",
        type: "command",
        isCompleted: false,
        suggestedGuide: {
          title: "SSH Server Setup and Security",
          description:
            "Complete guide to setting up SSH access, key management, and server security best practices",
          category: "devops",
          tags: ["ssh", "security", "server", "linux"],
        },
      },
      {
        id: "step-3",
        title: "Locate database container",
        description: "Find your PostgreSQL container name",
        code: "docker ps | grep postgres",
        docUrl: "https://docs.docker.com/engine/reference/commandline/ps/",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-4",
        title: "Copy dump file to container",
        description: "Transfer the dump file to the database container",
        code: "docker cp /path/to/dump.sql container_name:/tmp/dump.sql",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-5",
        title: "Restore the database",
        description: "Execute the restore command inside the container",
        code: "docker exec -i container_name psql -U username -d database_name < /tmp/dump.sql",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-6",
        title: "Verify restoration",
        description: "Check if tables and data were restored correctly",
        code: 'docker exec -it container_name psql -U username -d database_name -c "\\dt"',
        type: "verification",
        isCompleted: false,
      },
    ],
  },
  {
    id: "2",
    title: "Self-host Coolify on Ubuntu Server",
    description:
      "Step-by-step guide to install and configure Coolify on your own Ubuntu server for application deployment and management.",
    category: "deployment",
    tags: ["coolify", "self-hosting", "docker", "ubuntu"],
    difficulty: "advanced",
    estimatedTime: "45-60 minutes",
    author: "DevGuides Team",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    completedSteps: [],
    linkedGuides: [],
    parentGuides: [],
    steps: [
      {
        id: "step-1",
        title: "Prepare Ubuntu server",
        description:
          "Ensure you have a fresh Ubuntu 22.04+ server with at least 2GB RAM",
        type: "action",
        isCompleted: false,
        suggestedGuide: {
          title: "Ubuntu Server Initial Setup",
          description:
            "Complete server setup including user management, firewall configuration, and security hardening",
          category: "devops",
          tags: ["ubuntu", "server", "setup", "security"],
        },
      },
      {
        id: "step-2",
        title: "Update system packages",
        description: "Update all system packages to latest versions",
        code: "sudo apt update && sudo apt upgrade -y",
        docUrl: "https://help.ubuntu.com/community/AptGet/Howto",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-3",
        title: "Install Docker",
        description: "Install Docker Engine using the official script",
        code: "curl -fsSL https://get.docker.com | sh",
        docUrl: "https://docs.docker.com/engine/install/",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-4",
        title: "Add user to Docker group",
        description: "Allow your user to run Docker commands without sudo",
        code: "sudo usermod -aG docker $USER && newgrp docker",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-5",
        title: "Install Coolify",
        description: "Run the official Coolify installation script",
        code: "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash",
        docUrl: "https://coolify.io/docs/installation",
        type: "command",
        isCompleted: false,
      },
      {
        id: "step-6",
        title: "Access Coolify dashboard",
        description:
          "Open your browser and navigate to your server IP on port 8000",
        code: "http://your-server-ip:8000",
        type: "verification",
        isCompleted: false,
      },
    ],
  },
  {
    id: "3",
    title: "Setup Augment AI in VSCode",
    description:
      "Configure Augment AI extension in Visual Studio Code for enhanced coding experience with AI assistance.",
    category: "development",
    tags: ["vscode", "ai", "productivity"],
    difficulty: "beginner",
    estimatedTime: "10-15 minutes",
    author: "DevGuides Team",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    completedSteps: [],
    linkedGuides: [],
    parentGuides: [],
    steps: [
      {
        id: "step-1",
        title: "Install Augment extension",
        description:
          'Search for "Augment" in VSCode Extensions marketplace and install it',
        docUrl:
          "https://marketplace.visualstudio.com/items?itemName=augmentcode.augment",
        type: "action",
        isCompleted: false,
        suggestedGuide: {
          title: "VSCode Extensions Management",
          description:
            "Master guide for discovering, installing, and managing VSCode extensions effectively",
          category: "development",
          tags: ["vscode", "extensions", "productivity", "setup"],
        },
      },
      {
        id: "step-2",
        title: "Sign up for Augment account",
        description:
          "Create an account at augmentcode.com if you don't have one",
        type: "action",
        isCompleted: false,
      },
      {
        id: "step-3",
        title: "Authenticate in VSCode",
        description:
          'Use Command Palette (Ctrl/Cmd+Shift+P) and run "Augment: Sign In"',
        type: "action",
        isCompleted: false,
      },
      {
        id: "step-4",
        title: "Configure preferences",
        description:
          "Open Augment settings and configure your AI assistance preferences",
        type: "action",
        isCompleted: false,
      },
      {
        id: "step-5",
        title: "Test AI suggestions",
        description:
          "Open a code file and start typing to see AI-powered suggestions",
        type: "verification",
        isCompleted: false,
      },
    ],
  },
];
