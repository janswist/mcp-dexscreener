# Dexscreener MCP server

Basic MCP server for Dexscreener API based on their documentation (as of April 4th 2025): https://docs.dexscreener.com/api/reference

## Project setup

Install all the dependencies
```
npm run install
```

If you are using Claude Desktop, after pulling the code open the config file `claude_desktop_config.json` in VSCode:
- on MacOS:

  ```code ~/Library/Application\ Support/Claude/claude_desktop_config.json```

- on Windows:

  ```code $env:AppData\Claude\claude_desktop_config.json```
- more info: https://modelcontextprotocol.io/quickstart/server

In `claude_desktop_config.json` put `dexscreener` object:
```json
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

## Running the app

You can use [Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test the MCP server without using Claude Desktop - both for SDTIO version (default) and SSE version `index-sse.js` (server-sent events - can be hosted on remote server).