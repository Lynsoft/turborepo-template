import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for the guide structure
const guideSchema = z.object({
  title: z.string().describe("Clear, specific title describing the exact task"),
  description: z
    .string()
    .describe(
      "Detailed description explaining what users will accomplish and the context"
    ),
  category: z
    .enum([
      "database",
      "deployment",
      "development",
      "devops",
      "ai-tools",
      "frontend",
      "backend",
      "security",
    ])
    .describe("Guide category"),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced"])
    .describe("Difficulty level"),
  estimatedTime: z.string().describe("Time estimate in X-Y minutes format"),
  tags: z.array(z.string()).describe("Specific, searchable tags"),
  steps: z
    .array(
      z.object({
        id: z.string().describe("Step identifier"),
        title: z.string().describe("Descriptive action title"),
        description: z
          .string()
          .describe(
            "Detailed explanation with context, expected outcomes, and helpful tips"
          ),
        code: z.string().optional().describe("Exact command or code snippet"),
        type: z
          .enum(["action", "command", "verification", "note"])
          .describe("Step type"),
        suggestedGuide: z
          .object({
            title: z.string().describe("Related guide title"),
            description: z
              .string()
              .describe("What this related guide would cover"),
            category: z.string().describe("Appropriate category"),
            tags: z.array(z.string()).describe("Relevant tags"),
          })
          .optional()
          .describe("Optional suggested linked guide for complex steps"),
      })
    )
    .describe("Array of guide steps"),
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: guideSchema,
      prompt: `You are an expert technical writer who creates detailed step-by-step guides for developers.

Generate a comprehensive guide based on this request: "${prompt.trim()}"

**WRITING STYLE - Follow this example structure:**

EXCELLENT EXAMPLE:
Title: "Restoring a PostgreSQL dump into Coolify (VPS Docker container)"
Step: "Identify your dump type"
Description: "Plain SQL dump (.sql) → restore with psql. Custom/Binary dump (.dump or .backup) → restore with pg_restore. Check file type:"
Code: "file dump.sql"
Additional context: "UTF-8 text → plain SQL. PostgreSQL custom database dump → binary."

**KEY REQUIREMENTS:**

1. **Specific, actionable titles**: Not "Set up database" but "Create target database in PostgreSQL container"

2. **Rich descriptions with context**:
   - Explain WHY the step is needed
   - What users will see/expect
   - Include helpful tips and explanations
   - Mention common variations or alternatives
   - Add troubleshooting hints when relevant

3. **Exact, copy-pasteable commands**:
   - Use real examples with placeholder values
   - Include full command syntax
   - Show expected output when helpful

4. **Proper step types**:
   - "command": Terminal/CLI commands with code
   - "action": Manual tasks, UI interactions, file operations
   - "verification": Checking results, testing, confirming success
   - "note": Important warnings, tips, or explanatory information

5. **Logical flow**:
   - Each step builds on the previous
   - Include verification steps after major actions
   - End with confirmation of success
   - Add optional optimization/best practices steps

6. **Professional quality**:
   - Include edge cases and alternatives
   - Mention prerequisites clearly
   - Add best practices and security considerations
   - Provide troubleshooting guidance

**suggestedGuide Analysis:**
Only include when step involves:
- Complex server/infrastructure setup
- Security configurations
- Multi-step installations
- Cross-domain expertise (DB + Docker + networking)
- Reusable processes across multiple scenarios

**Examples of EXCELLENT steps:**
- "Upload dump to VPS" with scp command and clear file path explanation
- "Locate your Postgres container" with docker ps command and expected output
- "Verify restore" with specific query and what success looks like

Create 6-12 steps that are detailed, practical, and professional quality.`,
    });

    const guideData = result.object;

    // Process steps to ensure proper format
    const processedSteps = guideData.steps.map((step, index: number) => {
      const processedStep: {
        id: string;
        title: string;
        description: string;
        code: string;
        type: "action" | "command" | "verification" | "note";
        isCompleted: boolean;
        suggestedGuide?: {
          title: string;
          description: string;
          category: string;
          tags: string[];
        };
      } = {
        id: step.id || `step-${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "",
        code: step.code || "",
        type:
          (step.type as "action" | "command" | "verification" | "note") ||
          "action",
        isCompleted: false,
      };

      // Include suggestedGuide if it exists and is properly formatted
      if (
        step.suggestedGuide?.title &&
        step.suggestedGuide?.description &&
        step.suggestedGuide?.category
      ) {
        processedStep.suggestedGuide = {
          title: step.suggestedGuide.title,
          description: step.suggestedGuide.description,
          category: step.suggestedGuide.category,
          tags: Array.isArray(step.suggestedGuide.tags)
            ? step.suggestedGuide.tags
            : [],
        };
      }

      return processedStep;
    });

    const now = new Date();
    const finalGuide = {
      ...guideData,
      steps: processedSteps,
      category: guideData.category || "development",
      difficulty:
        (guideData.difficulty as "beginner" | "intermediate" | "advanced") ||
        "intermediate",
      estimatedTime: guideData.estimatedTime || "15-30 minutes",
      author: "AI Assistant",
      tags: Array.isArray(guideData.tags) ? guideData.tags : [],
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json({ guide: finalGuide });
  } catch (error) {
    console.error("Error generating guide:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
