
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, CheckCircle, AlertCircle, Settings, Zap, Calendar, Users, FileText, DollarSign } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'available' | 'premium';
  category: 'calendar' | 'communication' | 'productivity' | 'analytics' | 'crm';
  setupGuide?: string;
}

const ThirdPartyIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync meetings and automatically calculate costs',
      icon: <Calendar className="h-5 w-5" />,
      status: 'available',
      category: 'calendar',
      setupGuide: 'https://developers.google.com/calendar/api'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Import meetings from Outlook calendar',
      icon: <Calendar className="h-5 w-5" />,
      status: 'available',
      category: 'calendar'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get meeting cost notifications in Slack',
      icon: <Users className="h-5 w-5" />,
      status: 'premium',
      category: 'communication'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Track Teams meeting costs automatically',
      icon: <Users className="h-5 w-5" />,
      status: 'connected',
      category: 'communication'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Monitor Zoom meeting expenses',
      icon: <Users className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Track client meeting costs in CRM',
      icon: <DollarSign className="h-5 w-5" />,
      status: 'premium',
      category: 'crm'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Integrate meeting costs with deal tracking',
      icon: <DollarSign className="h-5 w-5" />,
      status: 'premium',
      category: 'crm'
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Link meeting costs to project budgets',
      icon: <FileText className="h-5 w-5" />,
      status: 'available',
      category: 'productivity'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Export meeting cost reports to Notion',
      icon: <FileText className="h-5 w-5" />,
      status: 'available',
      category: 'productivity'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track meeting ROI with advanced analytics',
      icon: <Zap className="h-5 w-5" />,
      status: 'premium',
      category: 'analytics'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Integrations' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'communication', name: 'Communication' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'crm', name: 'CRM' }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'available' : 'connected' 
          }
        : integration
    ));
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'premium':
        return <Badge className="bg-yellow-100 text-yellow-800"><DollarSign className="h-3 w-3 mr-1" />Premium</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Available</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Third-Party Integrations
        </CardTitle>
        <CardDescription>
          Connect your favorite tools to automate meeting cost tracking and enhance productivity insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={integration.status === 'connected'}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                      disabled={integration.status === 'premium'}
                    />
                    <span className="text-sm text-gray-600">
                      {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {integration.status === 'premium' && (
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Upgrade
                      </Button>
                    )}
                    
                    {integration.status !== 'premium' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/integrations/${integration.id}/setup`, '_blank')}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Setup
                        </Button>
                        
                        {integration.setupGuide && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(integration.setupGuide, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Guide
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No integrations found for this category.
            </div>
          )}

          {/* Integration Benefits */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why Connect Integrations?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatically import meeting data from your calendar</li>
              <li>• Get real-time cost notifications in your communication tools</li>
              <li>• Sync meeting costs with your project management and CRM systems</li>
              <li>• Generate comprehensive reports across all your tools</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThirdPartyIntegrations;
