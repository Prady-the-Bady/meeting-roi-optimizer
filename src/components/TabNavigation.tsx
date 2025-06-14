
import { Calculator, Clock, Users, DollarSign, TrendingUp, Zap, FileBarChart } from "lucide-react";

type TabType = 'calculator' | 'analytics' | 'ai' | 'team' | 'calendar' | 'integrations' | 'reports' | 'premium';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Insights', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Clock className="h-4 w-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Zap className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="h-4 w-4" /> },
    { id: 'premium', label: 'Premium', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-wrap border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as TabType)}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
