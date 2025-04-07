# Dexscreener MCP server

Basic MCP server for Dexscreener API based on their documentatio (as of April 4th 2025): https://docs.dexscreener.com/api/reference

## Usage

First: `npm run install` to install all the necessary node_modules

If you are using Claude Desktop, after pulling the code open the config file `claude_desktop_config.json` in VSCode:
- on MacOS: `code ~/Library/Application\ Support/Claude/claude_desktop_config.json`
- on Windows: `code $env:AppData\Claude\claude_desktop_config.json`
- more info: https://modelcontextprotocol.io/quickstart/server

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "dexscreener": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/PARENT/FOLDER/index.js"
      ]
    }
  }
}

```

You can use [Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test the MCP server without using Claude Desktop - both for SDTIO version (default) and SSE version `index-sse.js` (server-sent events - can be hosted on remote server).