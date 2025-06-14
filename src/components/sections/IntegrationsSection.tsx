
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, Users, ExternalLink, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThirdPartyIntegrations from "@/components/ThirdPartyIntegrations";

interface IntegrationsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
  onNavigate: (section: string) => void;
}

const IntegrationsSection = ({ onUpgrade, isUpgrading, onNavigate }: IntegrationsSectionProps) => {
  const { subscription } = useAuth();
  const isPremium = subscription.tier === 'premium' || subscription.tier === 'enterprise';

  const quickIntegrations = [
    {
      name: "Calendar",
      description: "Sync with Google Calendar and Outlook",
      icon: <Calendar className="h-5 w-5" />,
      available: true,
      action: () => onNavigate('calendar')
    },
    {
      name: "Team Communication", 
      description: "Connect with Slack and Microsoft Teams",
      icon: <Users className="h-5 w-5" />,
      available: isPremium,
      action: () => isPremium ? onUpgrade('premium') : onUpgrade('premium')
    },
    {
      name: "Advanced Analytics",
      description: "Export to BI tools and custom dashboards", 
      icon: <Zap className="h-5 w-5" />,
      available: subscription.tier === 'enterprise',
      action: () => subscription.tier === 'enterprise' ? onUpgrade('enterprise') : onUpgrade('enterprise')
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Integrations</h1>
          <p className="text-gray-600 mt-2">Connect your favorite tools and automate workflows</p>
        </div>
        <Badge className={`${isPremium ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {subscription.tier === 'enterprise' ? 'Enterprise' : subscription.tier === 'premium' ? 'Premium' : 'Free Plan'}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickIntegrations.map((integration, index) => (
          <Card key={index} className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${integration.available ? 'border-blue-200' : 'border-gray-200 opacity-75'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${integration.available ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {integration.icon}
                </div>
                {!integration.available && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              <Button 
                onClick={integration.action}
                className={`w-full ${integration.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                disabled={isUpgrading}
              >
                {integration.available ? (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Configure
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    {isUpgrading ? "Processing..." : "Upgrade"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Integrations Component */}
      <ThirdPartyIntegrations />

      {/* Integration Benefits */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Why Connect Integrations?</CardTitle>
          <CardDescription className="text-blue-700">
            Maximize your productivity with seamless tool connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Automation Benefits</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Automatically import meeting data from calendars</li>
                <li>• Real-time cost notifications in communication tools</li>
                <li>• Sync meeting costs with project management systems</li>
                <li>• Generate reports across all connected platforms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Time Savings</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Reduce manual data entry by 90%</li>
                <li>• Automated meeting cost tracking</li>
                <li>• One-click report generation</li>
                <li>• Centralized analytics dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsSection;
