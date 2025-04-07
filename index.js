import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import axios from 'axios'

// Initialize the MCP server
const server = new McpServer({
  name: 'dexscreener-api',
  version: '1.0.0'
})

// Base URL for DexScreener API
const BASE_URL = 'https://api.dexscreener.com'

// Helper function to make API requests
async function makeRequest(endpoint) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`)
    return response.data
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message)
    throw new Error(`Failed to fetch data from DexScreener API: ${error.message}`)
  }
}

// Tool: Get the latest token profiles (rate-limit 60 requests per minute)
server.tool(
  'getLatestTokenProfiles',
  {},
  async () => {
    const data = await makeRequest('/token-profiles/latest/v1')
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// Tool: Get the latest boosted tokens (rate-limit 60 requests per minute)
// response is too big for context window to handle this call more than once
server.tool(
  'getLatestBoostedTokens',
  {},
  async () => {
    const data = await makeRequest('/token-boosts/latest/v1')
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// // Tool: Get the tokens with most active boosts (rate-limit 60 requests per minute)
// response is too big for context window to handle this call more than once
server.tool(
  'getMostActiveBoostedTokens',
  {},
  async () => {
    const data = await makeRequest('/token-boosts/top/v1')
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// // Tool: Check orders paid for of token (rate-limit 60 requests per minute)
server.tool(
  'checkTokenOrders',
  {
    chainId: z.string().min(1).describe('Chain ID (e.g., "solana", "ethereum", "bsc")'),
    tokenAddress: z.string().min(1).describe('Token address')
  },
  async ({ chainId, tokenAddress }) => {
    const data = await makeRequest(`/orders/v1/${chainId}/${tokenAddress}`)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// // Tool: Get one or multiple pairs by chain and pair address (rate-limit 300 requests per minute)
server.tool(
  'getPairByChainAndAddress',
  {
    chainId: z.string().min(1).describe('Chain ID (e.g., "solana", "ethereum", "bsc")'),
    pairAddress: z.string().min(1).describe('Pair address')
  },
  async ({ chainId, pairAddress }) => {
    const data = await makeRequest(`/latest/dex/pairs/${chainId}/${pairAddress}`)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// // Tool:Search for pairs matching query (rate-limit 300 requests per minute)
server.tool(
  'searchPairs',
  { query: z.string().min(1).describe('Search query (e.g., "SOL/USDC")') },
  async ({ query }) => {
    const data = await makeRequest(`/latest/dex/search?q=${encodeURIComponent(query)}`)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// Tool: Get the pools of a given token address (rate-limit 300 requests per minute)
server.tool(
  'getTokenPools',
  {
    chainId: z.string().min(1).describe('Chain ID (e.g., "solana", "ethereum", "bsc")'),
    tokenAddress: z.string().min(1).describe('Token address')
  },
  async ({ chainId, tokenAddress }) => {
    const data = await makeRequest(`/token-pairs/v1/${chainId}/${tokenAddress}`)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// Tool: Get one or multiple pairs by token address (rate-limit 300 requests per minute)
server.tool(
  'getPairsByToken',
  {
    chainId: z.string().min(1).describe('Chain ID (e.g., "solana", "ethereum", "bsc")'),
    tokenAddress: z.string().min(1).describe('Token address')
  },
  async ({ chainId, tokenAddress }) => {
    const data = await makeRequest(`/tokens/v1/${chainId}/${tokenAddress}`)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    }
  }
)

// Connect the server to stdio transport
const transport = new StdioServerTransport()
await server.connect(transport)