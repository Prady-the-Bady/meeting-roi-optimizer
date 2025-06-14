
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, CheckCircle, AlertCircle, Settings, Zap, Calendar, Users, FileText, DollarSign, Crown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'available' | 'premium';
  category: 'calendar' | 'communication' | 'productivity' | 'analytics' | 'crm';
  requiredTier: 'free' | 'premium' | 'enterprise';
}

interface IntegrationsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
  onNavigate: (section: string) => void;
}

export function IntegrationsSection({ onUpgrade, isUpgrading, onNavigate }: IntegrationsSectionProps) {
  const { subscription, user, connectGoogle, connectMicrosoft } = useAuth();
  const { toast } = useToast();
  
  // Security: Properly check auth providers
  const isGoogleConnected = user?.app_metadata?.providers?.includes('google') || false;
  const isMicrosoftConnected = user?.app_metadata?.providers?.includes('azure') || false;

  const integrations: Integration[] = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync meetings and automatically calculate costs',
      icon: <Calendar className="h-5 w-5" />,
      status: isGoogleConnected ? 'connected' : 'available',
      category: 'calendar',
      requiredTier: 'premium'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Import meetings from Outlook calendar',
      icon: <Calendar className="h-5 w-5" />,
      status: isMicrosoftConnected ? 'connected' : 'available',
      category: 'calendar',
      requiredTier: 'premium'
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
      status: subscription.tier === 'premium' || subscription.tier === 'enterprise' ? 'available' : 'premium',
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
    }
  ];

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

  const handleToggle = async (integration: Integration) => {
    if (!hasAccess(integration)) {
      toast({ 
        title: "Upgrade Required", 
        variant: "destructive", 
        description: `This integration requires a ${integration.requiredTier} subscription.`
      });
      return;
    }

    // Security: Validate user is authenticated
    if (!user) {
      toast({ 
        title: "Authentication Required", 
        variant: "destructive", 
        description: "Please sign in to manage integrations."
      });
      return;
    }

    if (integration.id === 'google-calendar') {
      if (!isGoogleConnected) {
        try {
          await connectGoogle();
        } catch (error) {
          toast({ 
            title: "Connection Failed", 
            variant: "destructive", 
            description: "Failed to connect to Google Calendar. Please try again."
          });
        }
      } else {
        toast({ 
          title: "Disconnection not implemented", 
          description: "Please manage connections from your Google Account settings." 
        });
      }
    } else if (integration.id === 'outlook') {
      if (!isMicrosoftConnected) {
        try {
          await connectMicrosoft();
        } catch (error) {
          toast({ 
            title: "Connection Failed", 
            variant: "destructive", 
            description: "Failed to connect to Microsoft Outlook. Please try again."
          });
        }
      } else {
        toast({ 
          title: "Disconnection not implemented", 
          description: "Please manage connections from your Microsoft Account settings." 
        });
      }
    } else {
      toast({ 
        title: "Coming Soon", 
        description: `${integration.name} integration is coming soon.` 
      });
    }
  };

  const handleSetupClick = async (integration: Integration) => {
    if (!hasAccess(integration)) return;

    // Security: Validate user is authenticated
    if (!user) {
      toast({ 
        title: "Authentication Required", 
        variant: "destructive", 
        description: "Please sign in to setup integrations."
      });
      return;
    }

    if (integration.id === 'google-calendar') {
      if (isGoogleConnected) {
        onNavigate('calendar');
      } else {
        try {
          await connectGoogle();
        } catch (error) {
          toast({ 
            title: "Setup Failed", 
            variant: "destructive", 
            description: "Failed to setup Google Calendar integration."
          });
        }
      }
    } else if (integration.id === 'outlook') {
      if (isMicrosoftConnected) {
        onNavigate('calendar');
      } else {
        try {
          await connectMicrosoft();
        } catch (error) {
          toast({ 
            title: "Setup Failed", 
            variant: "destructive", 
            description: "Failed to setup Microsoft Outlook integration."
          });
        }
      }
    } else {
      toast({
        title: "Setup Not Available",
        description: `Setup for ${integration.name} is coming soon.`,
      });
    }
  };

  const getStatusBadge = (integration: Integration) => {
    if (!hasAccess(integration)) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Crown className="h-3 w-3 mr-1" />
          {integration.requiredTier}
        </Badge>
      );
    }

    switch (integration.status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Lock className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Available
          </Badge>
        );
    }
  };

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-2">Connect your favorite tools to automate meeting cost tracking</p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Crown className="h-5 w-5 mr-2 text-blue-600" />
                Premium Integrations
              </h3>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to connect with your favorite tools and automate meeting cost tracking.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Calendar Integration</h4>
                  <p className="text-sm text-gray-600">Google Calendar & Microsoft Outlook sync</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Communication Tools</h4>
                  <p className="text-sm text-gray-600">Slack, Teams, and Zoom notifications</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">CRM Integration</h4>
                  <p className="text-sm text-gray-600">Salesforce meeting cost tracking</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Automation</h4>
                  <p className="text-sm text-gray-600">Automated cost calculations and reports</p>
                </div>
              </div>

              <Button 
                onClick={() => onUpgrade('premium')}
                disabled={isUpgrading}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-2">Connect your favorite tools to automate meeting cost tracking</p>
      </div>

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
                        onCheckedChange={() => handleToggle(integration)}
                        disabled={!hasAccess(integration)}
                      />
                      <span className="text-sm text-gray-600">
                        {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {hasAccess(integration) ? (
                        <Button size="sm" variant="outline" onClick={() => handleSetupClick(integration)}>
                          <Settings className="h-3 w-3 mr-1" />
                          Setup
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => onUpgrade(integration.requiredTier as 'premium' | 'enterprise')}
                          disabled={isUpgrading}
                        >
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
