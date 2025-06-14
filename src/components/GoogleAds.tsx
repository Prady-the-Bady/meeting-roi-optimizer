
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, X } from 'lucide-react';

interface GoogleAdsProps {
  adSlot?: string;
  className?: string;
  showUpgradePrompt?: boolean;
  publisherId?: string;
  onUpgradeClick?: () => void;
}

const GoogleAds = ({ 
  adSlot = "5858753720", 
  className = "", 
  showUpgradePrompt = true,
  publisherId = "ca-pub-3940256099942544", // Using Google's test ID for reliable testing
  onUpgradeClick
}: GoogleAdsProps) => {
  
  useEffect(() => {
    // Load AdSense script if not already loaded
    const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense initialization error:', error);
        }
      };
      document.head.appendChild(script);
    } else {
      // Script already exists, just push the ad
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [publisherId, adSlot]); // Re-run effect if publisherId or adSlot change

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  return (
    <Card className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Sponsored Content</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-yellow-600">
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Google AdSense Ad Unit */}
        <div className="bg-white border border-yellow-200 rounded-lg overflow-hidden min-h-[250px] flex items-center justify-center">
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block', 
              width: '100%', 
              height: '250px',
              backgroundColor: '#f8f9fa'
            }}
            data-ad-client={publisherId}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {showUpgradePrompt && (
          <div className="mt-3 text-center">
            <p className="text-xs text-yellow-700 mb-2">
              Remove ads and unlock premium features
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
              onClick={handleUpgradeClick}
            >
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAds;
