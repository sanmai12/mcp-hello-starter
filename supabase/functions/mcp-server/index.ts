import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MCPRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// MCP Server implementation
class MCPServer {
  private tools = [
    {
      name: "hello",
      description: "Returns a greeting message",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name to greet"
          }
        },
        required: ["name"]
      }
    },
    {
      name: "echo",
      description: "Echoes back the input",
      inputSchema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message to echo"
          }
        },
        required: ["message"]
      }
    }
  ];

  private resources = [
    {
      uri: "demo://metadata",
      name: "Demo Metadata",
      description: "Sample metadata resource",
      mimeType: "application/json"
    }
  ];

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    console.log('MCP Request received:', JSON.stringify(request, null, 2));

    try {
      switch (request.method) {
        case "ping":
          return this.handlePing(request);
        
        case "initialize":
          return this.handleInitialize(request);
        
        case "tools/list":
          return this.handleToolsList(request);
        
        case "tools/call":
          return this.handleToolsCall(request);
        
        case "resources/list":
          return this.handleResourcesList(request);
        
        case "resources/read":
          return this.handleResourcesRead(request);
        
        default:
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32601,
              message: "Method not found",
              data: { method: request.method }
            }
          };
      }
    } catch (error) {
      console.error('Error handling MCP request:', error);
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: "Internal error",
          data: { error: error.message }
        }
      };
    }
  }

  private handlePing(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        message: "pong",
        timestamp: new Date().toISOString(),
        server: "MCP Demo Server v1.0"
      }
    };
  }

  private handleInitialize(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
          resources: {},
          logging: {}
        },
        serverInfo: {
          name: "mcp-demo-server",
          version: "1.0.0"
        }
      }
    };
  }

  private handleToolsList(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: this.tools
      }
    };
  }

  private handleToolsCall(request: MCPRequest): MCPResponse {
    const { name, arguments: args } = request.params || {};
    
    switch (name) {
      case "hello":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: `Hello, ${args?.name || 'World'}! This is a response from the MCP server.`
              }
            ]
          }
        };
      
      case "echo":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: `Echo: ${args?.message || 'No message provided'}`
              }
            ]
          }
        };
      
      default:
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32602,
            message: "Tool not found",
            data: { tool: name }
          }
        };
    }
  }

  private handleResourcesList(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        resources: this.resources
      }
    };
  }

  private handleResourcesRead(request: MCPRequest): MCPResponse {
    const { uri } = request.params || {};
    
    if (uri === "demo://metadata") {
      return {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          contents: [
            {
              uri: "demo://metadata",
              mimeType: "application/json",
              text: JSON.stringify({
                server: "MCP Demo Server",
                version: "1.0.0",
                capabilities: ["tools", "resources"],
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        }
      };
    }
    
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32602,
        message: "Resource not found",
        data: { uri }
      }
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { request } = await req.json();
    console.log('Received request:', request);
    
    const mcpServer = new MCPServer();
    const response = await mcpServer.handleRequest(request);
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in mcp-server function:', error);
    return new Response(JSON.stringify({ 
      error: 'Invalid request format',
      details: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});