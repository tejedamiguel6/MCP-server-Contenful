import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT;

// Validate required environment variables
if (
  !CONTENTFUL_SPACE_ID ||
  !CONTENTFUL_ACCESS_TOKEN ||
  !CONTENTFUL_ENVIRONMENT
) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

const server = new McpServer({
  name: "Contentful Tools",
  version: "1.0.0",
});

server.tool("get-content-types", "get content types", {}, async () => {
  const restEndpoint = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/content_types`;
  try {
    const response = await fetch(restEndpoint, {
      headers: {
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`http error! status ${response.status}`);
    }
    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            data.items.map((item: any) => ({
              id: item.sys.id,
              name: item.name,
            })),
            null,
            2
          ),
        },
      ],
    };
  } catch (error: any) {
    console.error("Error fetching content types:", error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

server.tool(
  "get-entries",
  "Get entries for a specific content type",
  {
    contentType: z.string(),
  },
  async (parameters) => {
    const { contentType } = parameters;
    const entriesEndpoint = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?content_type=${contentType}&limit=10`;

    try {
      const response = await fetch(entriesEndpoint, {
        headers: {
          Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      console.error("Error fetching entries:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `CONTENTFUL MCP Server running on stdio - Connected to space: ${CONTENTFUL_SPACE_ID}`
  );
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
