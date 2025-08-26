import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for guide suggestions
const guideSuggestionsSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string().describe("Clear, specific title for the suggested guide"),
        description: z
          .string()
          .describe("Brief description of what this guide would cover"),
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
          .describe("Appropriate category for the suggested guide"),
        tags: z
          .array(z.string())
          .describe("Relevant tags for the suggested guide"),
        difficulty: z
          .enum(["beginner", "intermediate", "advanced"])
          .describe("Suggested difficulty level"),
        estimatedTime: z
          .string()
          .describe("Estimated time in X-Y minutes format"),
        relevanceReason: z
          .string()
          .describe("Brief explanation of why this guide is relevant to the current step"),
        priority: z
          .number()
          .min(1)
          .max(10)
          .describe("Priority score from 1-10, with 10 being most relevant"),
      })
    )
    .max(3)
    .describe("Array of up to 3 contextual guide suggestions"),
});

interface SuggestGuidesRequest {
  currentGuide: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    difficulty: string;
  };
  currentStep: {
    id: string;
    title: string;
    description: string;
    type: string;
    code?: string;
  };
  stepIndex: number;
  totalSteps: number;
  completedSteps: number;
  userContext?: {
    recentCategories?: string[];
    preferredDifficulty?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestGuidesRequest = await request.json();

    // Validate required fields
    if (!body.currentGuide || !body.currentStep) {
      return NextResponse.json(
        { error: "Current guide and step information are required" },
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

    const {
      currentGuide,
      currentStep,
      stepIndex,
      totalSteps,
      completedSteps,
      userContext,
    } = body;

    // Create context for AI analysis
    const contextPrompt = `
CURRENT GUIDE CONTEXT:
- Title: "${currentGuide.title}"
- Description: "${currentGuide.description}"
- Category: ${currentGuide.category}
- Tags: ${currentGuide.tags.join(", ")}
- Difficulty: ${currentGuide.difficulty}

CURRENT STEP CONTEXT:
- Step ${stepIndex + 1} of ${totalSteps}
- Title: "${currentStep.title}"
- Description: "${currentStep.description}"
- Type: ${currentStep.type}
${currentStep.code ? `- Code: ${currentStep.code}` : ""}

PROGRESS CONTEXT:
- Completed steps: ${completedSteps}/${totalSteps}
- Progress: ${Math.round((completedSteps / totalSteps) * 100)}%

USER CONTEXT:
${userContext?.recentCategories ? `- Recent categories: ${userContext.recentCategories.join(", ")}` : ""}
${userContext?.preferredDifficulty ? `- Preferred difficulty: ${userContext.preferredDifficulty}` : ""}
`;

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: guideSuggestionsSchema,
      prompt: `You are an expert technical guide curator who suggests relevant follow-up guides based on the current context.

${contextPrompt}

**TASK**: Generate 1-3 highly relevant guide suggestions that would be valuable for someone working on this current step.

**SUGGESTION CRITERIA**:

1. **Contextual Relevance**: Suggestions should be directly related to:
   - Technologies/tools mentioned in the current step
   - Common next steps or prerequisites
   - Related troubleshooting or advanced topics
   - Complementary skills or setups

2. **Practical Value**: Each suggestion should:
   - Address a real need that might arise from this step
   - Be actionable and specific (not generic)
   - Fill knowledge gaps or extend capabilities
   - Solve common problems users encounter

3. **Appropriate Scope**: Suggestions should be:
   - Substantial enough to warrant a separate guide (6+ steps)
   - Not too broad or overwhelming
   - Focused on a specific outcome or skill

**EXAMPLES OF GOOD SUGGESTIONS**:
- If current step involves Docker: "Setting up Docker Compose for Multi-Service Applications"
- If current step involves database setup: "Implementing Database Backup and Recovery Strategies"
- If current step involves API configuration: "Securing APIs with Authentication and Rate Limiting"
- If current step involves deployment: "Setting up CI/CD Pipeline with GitHub Actions"

**AVOID**:
- Generic guides that aren't specifically relevant
- Suggestions that duplicate the current guide's content
- Overly basic guides if the current guide is advanced
- Suggestions that require completely different tech stacks

**PRIORITY SCORING**:
- 9-10: Directly needed for the current workflow
- 7-8: Highly complementary and commonly needed
- 5-6: Related and potentially useful
- 1-4: Tangentially related (avoid these)

Focus on quality over quantity. It's better to suggest 1-2 highly relevant guides than 3 mediocre ones.`,
    });

    const suggestions = result.object.suggestions;

    // Sort suggestions by priority (highest first)
    const sortedSuggestions = suggestions.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({ 
      suggestions: sortedSuggestions,
      context: {
        currentGuide: currentGuide.title,
        currentStep: currentStep.title,
        stepProgress: `${stepIndex + 1}/${totalSteps}`,
      }
    });
  } catch (error) {
    console.error("Error generating guide suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
