
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, CheckCircle, AlertCircle, Settings, Zap, Calendar, Users, FileText, DollarSign, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'available' | 'premium';
  category: 'calendar' | 'communication' | 'productivity' | 'analytics' | 'crm';
  setupGuide?: string;
  requiredTier?: 'free' | 'premium' | 'enterprise';
}

const ThirdPartyIntegrations = () => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync meetings and automatically calculate costs',
      icon: <Calendar className="h-5 w-5" />,
      status: 'available',
      category: 'calendar',
      setupGuide: 'https://developers.google.com/calendar/api',
      requiredTier: 'free'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Import meetings from Outlook calendar',
      icon: <Calendar className="h-5 w-5" />,
      status: 'available',
      category: 'calendar',
      requiredTier: 'free'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get meeting cost notifications in Slack',
      icon: <Users className="h-5 w-5" />,
      status: subscription.tier === 'premium' || subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'communication',
      requiredTier: 'premium'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Track Teams meeting costs automatically',
      icon: <Users className="h-5 w-5" />,
      status: 'connected',
      category: 'communication',
      requiredTier: 'premium'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Monitor Zoom meeting expenses',
      icon: <Users className="h-5 w-5" />,
      status: subscription.tier === 'premium' || subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'communication',
      requiredTier: 'premium'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Track client meeting costs in CRM',
      icon: <DollarSign className="h-5 w-5" />,
      status: subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'crm',
      requiredTier: 'enterprise'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Integrate meeting costs with deal tracking',
      icon: <DollarSign className="h-5 w-5" />,
      status: subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'crm',
      requiredTier: 'enterprise'
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Link meeting costs to project budgets',
      icon: <FileText className="h-5 w-5" />,
      status: subscription.tier === 'premium' || subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'productivity',
      requiredTier: 'premium'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Export meeting cost reports to Notion',
      icon: <FileText className="h-5 w-5" />,
      status: 'available',
      category: 'productivity',
      requiredTier: 'free'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track meeting ROI with advanced analytics',
      icon: <Zap className="h-5 w-5" />,
      status: subscription.tier === 'enterprise' ? 'available' : 'premium',
      category: 'analytics',
      requiredTier: 'enterprise'
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

  const hasAccess = (integration: Integration) => {
    const tierLevels = { free: 0, premium: 1, enterprise: 2 };
    const userLevel = tierLevels[subscription.tier];
    const requiredLevel = tierLevels[integration.requiredTier || 'free'];
    return userLevel >= requiredLevel;
  };

  const toggleIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    if (!hasAccess(integration)) {
      toast({
        title: "Upgrade Required",
        description: `This integration requires ${integration.requiredTier} subscription.`,
        variant: "destructive",
      });
      return;
    }

    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'available' : 'connected' 
          }
        : integration
    ));

    toast({
      title: integration.status === 'connected' ? "Integration Disabled" : "Integration Enabled",
      description: `${integration.name} has been ${integration.status === 'connected' ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSetup = (integration: Integration) => {
    if (!hasAccess(integration)) {
      toast({
        title: "Upgrade Required",
        description: `This integration requires ${integration.requiredTier} subscription.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Setup Started",
      description: `Setting up ${integration.name} integration...`,
    });
    
    // Simulate setup process
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: 'connected' as const } : i
      ));
      toast({
        title: "Setup Complete",
        description: `${integration.name} has been successfully connected!`,
      });
    }, 2000);
  };

  const getStatusBadge = (integration: Integration) => {
    if (!hasAccess(integration)) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Crown className="h-3 w-3 mr-1" />{integration.requiredTier}</Badge>;
    }

    switch (integration.status) {
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
                className={`border rounded-lg p-4 space-y-3 transition-colors ${
                  hasAccess(integration) ? 'hover:bg-gray-50' : 'opacity-60 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      hasAccess(integration) ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration)}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={integration.status === 'connected'}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                      disabled={!hasAccess(integration)}
                    />
                    <span className="text-sm text-gray-600">
                      {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {hasAccess(integration) ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetup(integration)}
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
                    ) : (
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Upgrade to {integration.requiredTier}
                      </Button>
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
