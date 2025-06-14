
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, X } from 'lucide-react';

interface GoogleAdsProps {
  adSlot?: string;
  className?: string;
  showUpgradePrompt?: boolean;
}

const GoogleAds = ({ adSlot = "demo-ad-slot", className = "", showUpgradePrompt = true }: GoogleAdsProps) => {
  useEffect(() => {
    // In a real implementation, you would load Google AdSense here
    // For now, we'll show a placeholder
    console.log('Google Ads would load here with slot:', adSlot);
  }, [adSlot]);

  return (
    <Card className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Advertisement</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-yellow-600">
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Ad Placeholder Content */}
        <div className="bg-white border border-yellow-200 rounded-lg p-6 text-center">
          <div className="space-y-3">
            <div className="w-full h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-medium">Google Ads Space</span>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Boost Your Business Productivity</p>
              <p>Professional meeting solutions for modern teams</p>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </div>

        {showUpgradePrompt && (
          <div className="mt-3 text-center">
            <p className="text-xs text-yellow-700 mb-2">
              Remove ads and unlock premium features
            </p>
            <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300">
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAds;
