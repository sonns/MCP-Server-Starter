/**
 * Prompts registry
 * Register all MCP prompts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  type GetPromptRequest,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Register all prompts with the MCP server
 */
export function registerPrompts(server: Server): void {
  // List available prompts
  // eslint-disable-next-line @typescript-eslint/require-await
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "greeting",
          description: "Generate a personalized greeting",
          arguments: {
            type: "object",
            properties: {
              name: { type: "string", description: "The name of the person to greet" },
              style: {
                type: "string",
                enum: ["formal", "casual"],
                description: "The style of greeting (formal or casual)",
                default: "casual",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "code_review",
          description: "Provide a code review for a given code snippet",
          arguments: {
            type: "object",
            properties: {
              code: { type: "string", description: "The code snippet to review" },
              language: {
                type: "string",
                description: "The programming language of the code",
                default: "typescript",
              },
              focus: {
                type: "string",
                description: "Specific areas to focus on (e.g., 'performance', 'security')",
                default: "readability",
              },
            },
            required: ["code"],
          },
        },
      ],
    };
  });

  // Get specific prompt
  // eslint-disable-next-line @typescript-eslint/require-await
  server.setRequestHandler(GetPromptRequestSchema, async (request: GetPromptRequest) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "greeting": {
        const { name: userName, style } = args as { name: string; style: string };
        const greeting = style === "formal" ? `Good day, ${userName}.` : `Hey there, ${userName}!`;
        return {
          message: {
            role: "assistant",
            content: [{ type: "text", text: greeting }],
          },
        };
      }
      case "code_review": {
        const { code, language, focus } = args as {
          code: string;
          language: string;
          focus: string;
        };
        const review = `Reviewing ${language} code focusing on ${focus}:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n[AI Code Review Placeholder]`;
        return {
          message: {
            role: "assistant",
            content: [{ type: "text", text: review }],
          },
        };
      }
      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  });
}
