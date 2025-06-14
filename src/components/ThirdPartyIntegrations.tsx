
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Zap, Slack, MessageSquare, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  webhook?: string;
}

const ThirdPartyIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      icon: <Zap className="h-5 w-5" />,
      connected: false,
      webhook: ''
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send meeting summaries to channels',
      icon: <Slack className="h-5 w-5" />,
      connected: false,
      webhook: ''
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Post cost alerts to Teams channels',
      icon: <MessageSquare className="h-5 w-5" />,
      connected: false,
      webhook: ''
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Save meeting data to Notion pages',
      icon: <FileText className="h-5 w-5" />,
      connected: false,
      webhook: ''
    }
  ]);

  const { toast } = useToast();

  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, ...updates } : integration
    ));
  };

  const testWebhook = async (integration: Integration) => {
    if (!integration.webhook) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL first",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(integration.webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: `Test webhook from Meeting Cost Calculator - ${integration.name} integration`
        }),
      });

      toast({
        title: "Webhook Test Sent",
        description: `Test webhook sent to ${integration.name}. Check your integration to confirm it was received.`,
      });
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Failed to send test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const toggleIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (!integration.connected && !integration.webhook) {
      toast({
        title: "Webhook Required",
        description: "Please enter a webhook URL before enabling the integration.",
        variant: "destructive",
      });
      return;
    }

    updateIntegration(id, { connected: !integration.connected });
    
    toast({
      title: integration.connected ? "Integration Disabled" : "Integration Enabled",
      description: `${integration.name} integration has been ${integration.connected ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Third-Party Integrations</h2>
        <p className="text-gray-600">Connect your meeting data with your favorite tools and workflows.</p>
      </div>

      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integration.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <Switch
                        checked={integration.connected}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`webhook-${integration.id}`}>Webhook URL</Label>
                      <Input
                        id={`webhook-${integration.id}`}
                        placeholder={`Enter your ${integration.name} webhook URL`}
                        value={integration.webhook || ''}
                        onChange={(e) => updateIntegration(integration.id, { webhook: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(integration)}
                        disabled={!integration.webhook}
                      >
                        Test Webhook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://zapier.com/apps/${integration.id}/integrations`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Setup Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Generate API keys to access meeting data programmatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>API Endpoint</Label>
                  <Input value="https://api.meetingcalculator.com/v1/" readOnly />
                </div>
                <div>
                  <Label>API Key</Label>
                  <div className="flex space-x-2">
                    <Input value="••••••••••••••••••••••••••••••••" readOnly />
                    <Button variant="outline">Generate New</Button>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Available Endpoints</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• GET /meetings - List all meetings</li>
                    <li>• POST /meetings - Create new meeting</li>
                    <li>• GET /meetings/{id} - Get meeting details</li>
                    <li>• GET /analytics - Get cost analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Set up automatic notifications and actions based on meeting costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">High Cost Alert</h4>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Send notification when meeting cost exceeds $500
                  </p>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Weekly Summary</h4>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Send weekly meeting cost summary every Friday
                  </p>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Long Meeting Alert</h4>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Alert when meeting exceeds 60 minutes
                  </p>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThirdPartyIntegrations;
