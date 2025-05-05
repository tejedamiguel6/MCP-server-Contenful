[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/tejedamiguel6-mcp-server-contenful-badge.png)](https://mseep.ai/app/tejedamiguel6-mcp-server-contenful)

# Contentful MCP Server

A Model Context Protocol (MCP) server that allows Claude to interact with Contentful CMS data directly. This integration enables Claude to fetch content types and entries from your Contentful space.

## Features

- Fetch all content types from your Contentful space
- Retrieve entries for specific content types
- Structured responses for easy consumption by AI assistants

## Prerequisites

- Node.js (v16 or higher)
- A Contentful account with API keys
- Claude Desktop (to use the MCP server with Claude)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/contentful-mcp-server.git
   cd contentful-mcp-server

2.Install dependencies:
 npm install

Create a .env file in the root directory with your Contentful credentials:
4. CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=develop
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token


npm run build


Or configure a build script in your package.json:
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}

##Configuration for Claude Desktop
```
{
  "mcpServers": {
    "contentful": {
      "command": "node",
      "args": [
        "/absolute/path/to/contentful-mcp-server/dist/index.js"
      ]
    }
  }
}
```
