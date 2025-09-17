import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [request, setRequest] = useState('{"jsonrpc": "2.0", "id": 1, "method": "ping", "params": {}}');
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMcpRequest = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mcp-server', {
        body: { request: JSON.parse(request) }
      });
      
      if (error) throw error;
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const exampleRequests = [
    {
      name: "Ping",
      description: "Basic connectivity test",
      request: '{"jsonrpc": "2.0", "id": 1, "method": "ping", "params": {}}'
    },
    {
      name: "List Tools",
      description: "Get available MCP tools",
      request: '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}'
    },
    {
      name: "Hello World",
      description: "Call hello tool",
      request: '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "hello", "arguments": {"name": "World"}}}'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">MCP Server Demo</h1>
          <p className="text-xl text-muted-foreground">
            Model Context Protocol (MCP) server implementation demo
          </p>
          <Badge variant="secondary">Web-based MCP Protocol Simulation</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>MCP Request</CardTitle>
              <CardDescription>
                Send JSON-RPC 2.0 formatted MCP requests to the server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Example Requests:</label>
                <div className="grid grid-cols-1 gap-2">
                  {exampleRequests.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setRequest(example.request)}
                      className="text-left justify-start"
                    >
                      <div>
                        <div className="font-medium">{example.name}</div>
                        <div className="text-xs text-muted-foreground">{example.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Request JSON:</label>
                <Textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  className="font-mono text-sm"
                  rows={8}
                  placeholder="Enter MCP JSON-RPC request..."
                />
              </div>
              
              <Button 
                onClick={handleMcpRequest} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Send MCP Request"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>MCP Response</CardTitle>
              <CardDescription>
                Server response in JSON-RPC 2.0 format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={response}
                readOnly
                className="font-mono text-sm"
                rows={16}
                placeholder="Response will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About MCP Protocol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">JSON-RPC 2.0</h4>
                <p className="text-muted-foreground">
                  MCP uses JSON-RPC 2.0 for message exchange between client and server
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">STDIN/STDOUT</h4>
                <p className="text-muted-foreground">
                  Local mode uses standard input/output for communication
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tools & Resources</h4>
                <p className="text-muted-foreground">
                  Servers expose tools and resources that clients can discover and use
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;