# MCP Server Demo

A web-based demonstration of the Model Context Protocol (MCP) architecture and tooling.

## Overview

This project provides a working implementation of an MCP server to help teams gain hands-on experience with MCP architecture. While the original specification calls for a Node.js STDIN/STDOUT implementation, this demo uses Supabase Edge Functions (Deno-based) and a React frontend to simulate the MCP protocol.

## Core Features

- **MCP Protocol Implementation**: Full JSON-RPC 2.0 compliant MCP server
- **Interactive Web Interface**: Test MCP requests directly in the browser
- **Example Tools**: Pre-built tools (hello, echo) demonstrating MCP capabilities
- **Resource Management**: Sample resource handling with metadata exposure
- **Real-time Testing**: Immediate request/response cycle visualization

## MCP Lifecycle Explained

The Model Context Protocol follows this lifecycle:

1. **Initialization**: Client connects and negotiates capabilities
2. **Discovery**: Client discovers available tools and resources
3. **Invocation**: Client calls tools with structured arguments
4. **Response**: Server processes and returns structured results
5. **Resource Access**: Optional access to server-managed resources

### Request/Response Flow

```
Client Request (JSON-RPC 2.0)
├── jsonrpc: "2.0"
├── id: unique identifier
├── method: MCP method name
└── params: method parameters

Server Response (JSON-RPC 2.0)
├── jsonrpc: "2.0"
├── id: matching request id
└── result: success data OR error: error details
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd mcp-server-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:8080`

## Usage

### Testing MCP Requests

The web interface provides three example request types:

1. **Ping**: Basic connectivity test
   ```json
   {"jsonrpc": "2.0", "id": 1, "method": "ping", "params": {}}
   ```

2. **List Tools**: Discover available tools
   ```json
   {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
   ```

3. **Call Tool**: Execute the hello tool
   ```json
   {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "hello", "arguments": {"name": "World"}}}
   ```

### Available MCP Methods

- `ping` - Server health check
- `initialize` - Protocol initialization
- `tools/list` - List available tools
- `tools/call` - Execute a tool
- `resources/list` - List available resources
- `resources/read` - Read resource content

### Available Tools

- **hello**: Returns a greeting message
- **echo**: Echoes back the input message

## Architecture

```
┌─────────────────┐    HTTP/JSON-RPC    ┌─────────────────┐
│   React Client  │ ◄─────────────────► │ Supabase Edge   │
│   (Frontend)    │                     │   Function      │
└─────────────────┘                     │  (MCP Server)   │
                                        └─────────────────┘
```

### Components

- **Frontend**: React application with TypeScript and Tailwind CSS
- **Backend**: Supabase Edge Function implementing MCP protocol
- **Protocol**: JSON-RPC 2.0 over HTTP (simulating STDIN/STDOUT)

## Extending the Demo

### Adding New Tools

1. Add tool definition to the `tools` array in `supabase/functions/mcp-server/index.ts`
2. Implement the tool logic in the `handleToolsCall` method
3. Test via the web interface

### Adding Resources

1. Add resource definition to the `resources` array
2. Implement resource reading logic in `handleResourcesRead`
3. Access via the `resources/read` method

## Limitations & Production Considerations

This demo is designed for learning and prototyping. For production use:

- Implement proper authentication and authorization
- Add request validation and sanitization
- Implement rate limiting and error handling
- Consider using WebSockets for real-time communication
- Add comprehensive logging and monitoring

## Comparison with Node.js STDIN Implementation

| Feature | This Demo | Node.js STDIN |
|---------|-----------|---------------|
| Protocol | HTTP + JSON-RPC | STDIN/STDOUT + JSON-RPC |
| Runtime | Deno (Edge Functions) | Node.js |
| Interface | Web Browser | Command Line |
| Deployment | Cloud (Supabase) | Local Process |
| Testing | Interactive UI | CLI/Scripts |

## Demo Script

1. **Start the application**: `npm run dev`
2. **Send a ping**: Click "Ping" example → "Send MCP Request"
3. **List tools**: Click "List Tools" → observe available tools
4. **Call hello tool**: Click "Hello World" → see greeting response
5. **Custom request**: Modify JSON and test edge cases

Expected response for ping:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "message": "pong",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "server": "MCP Demo Server v1.0"
  }
}
```

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## License

MIT License - see LICENSE file for details.