#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getCurrentBuffer,
  listOpenBuffers,
  getBufferContent,
  updateBuffer,
  reloadBuffer,
  reloadAllBuffers,
} from "./lib/nvim-operations.js";

/**
 * Create and start the MCP server
 */
async function main() {
  const server = new Server(
    {
      name: "nvim-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );

  /**
   * List available resources
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "nvim://current-buffer",
          name: "Current Neovim Buffer",
          description: "The currently active buffer in Neovim",
          mimeType: "text/plain",
        },
        {
          uri: "nvim://open-buffers",
          name: "Open Neovim Buffers",
          description:
            "List of all open buffers in Neovim instances running in current directory",
          mimeType: "application/json",
        },
      ],
    };
  });

  /**
   * Read resource content
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri.toString();

    if (uri === "nvim://current-buffer") {
      const current = await getCurrentBuffer();
      if (!current) {
        return {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: "No Neovim instance found in current directory",
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: `Path: ${current.path}\n\n${current.content}`,
          },
        ],
      };
    }

    if (uri === "nvim://open-buffers") {
      const buffers = await listOpenBuffers();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(buffers, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  /**
   * List available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_nvim_buffers",
          description:
            "List all open buffers in Neovim instances running in the current directory",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_current_buffer",
          description: "Get the currently active buffer in Neovim",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_buffer_content",
          description: "Get the content of a specific buffer by path",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The file path of the buffer",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "update_buffer",
          description:
            "Update the content of a buffer in Neovim. Changes appear immediately in the editor.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The file path of the buffer to update",
              },
              content: {
                type: "string",
                description: "The new content for the buffer",
              },
            },
            required: ["path", "content"],
          },
        },
        {
          name: "reload_buffer",
          description:
            "Reload a buffer from disk. Use this after editing a file externally to refresh the buffer in Neovim.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The file path of the buffer to reload",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "reload_all_buffers",
          description:
            "Check all open buffers and reload any that have changed on disk. Use this after editing files externally.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    };
  });

  /**
   * Handle tool calls
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === "list_nvim_buffers") {
        const buffers = await listOpenBuffers();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(buffers, null, 2),
            },
          ],
        };
      }

      if (name === "get_current_buffer") {
        const current = await getCurrentBuffer();
        if (!current) {
          return {
            content: [
              {
                type: "text",
                text: "No Neovim instance found in current directory",
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Current buffer: ${current.path}\n\n${current.content}`,
            },
          ],
        };
      }

      if (name === "get_buffer_content") {
        const content = await getBufferContent(args.path);
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      if (name === "update_buffer") {
        const result = await updateBuffer(args.path, args.content);
        return {
          content: [
            {
              type: "text",
              text: `Successfully updated buffer: ${result.path}`,
            },
          ],
        };
      }

      if (name === "reload_buffer") {
        const result = await reloadBuffer(args.path);
        return {
          content: [
            {
              type: "text",
              text: `Successfully reloaded buffer: ${result.path}`,
            },
          ],
        };
      }

      if (name === "reload_all_buffers") {
        const result = await reloadAllBuffers();
        return {
          content: [
            {
              type: "text",
              text: result.message,
            },
          ],
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Neovim MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
