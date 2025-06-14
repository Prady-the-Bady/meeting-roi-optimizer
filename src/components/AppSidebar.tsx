
import { Scissors, TrendingUp, Zap, Users, Clock, FileBarChart, Crown, Settings, Home, History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  available: boolean;
  premium?: boolean;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { subscription } = useAuth();

  const mainItems: MenuItem[] = [
    {
      id: "overview",
      title: "Overview",
      icon: Home,
      available: true,
    },
    {
      id: "calculator",
      title: "Meeting Calculator",
      icon: Scissors,
      available: true,
    },
    {
      id: "history",
      title: "Meeting History",
      icon: History,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
  ];

  const analyticsItems: MenuItem[] = [
    {
      id: "analytics",
      title: "Analytics",
      icon: TrendingUp,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
    {
      id: "reports",
      title: "Advanced Reports",
      icon: FileBarChart,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
  ];

  const aiItems: MenuItem[] = [
    {
      id: "ai-insights",
      title: "AI Insights",
      icon: Zap,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
  ];

  const collaborationItems: MenuItem[] = [
    {
      id: "team",
      title: "Team Management",
      icon: Users,
      available: subscription.tier === 'enterprise',
      premium: subscription.tier !== 'enterprise',
    },
    {
      id: "calendar",
      title: "Calendar Integration",
      icon: Clock,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Settings,
      available: subscription.tier !== 'free',
      premium: subscription.tier === 'free',
    },
  ];

  const renderMenuItems = (items: MenuItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => onSectionChange(item.id)}
            isActive={activeSection === item.id}
            className={!item.available ? "opacity-60" : ""}
          >
            <item.icon />
            <span>{item.title}</span>
            {item.premium && (
              <Crown className="h-3 w-3 text-yellow-500 ml-auto" />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-bold">CostCut AI</span>
        </div>
        <div className="mt-2">
          {subscription.tier === 'enterprise' && (
            <Badge className="bg-purple-100 text-purple-800">
              <Crown className="h-3 w-3 mr-1" />
              Enterprise
            </Badge>
          )}
          {subscription.tier === 'premium' && (
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          {subscription.tier === 'free' && (
            <Badge variant="outline">Free</Badge>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(analyticsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI & Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(aiItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(collaborationItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500">
          Need help? Contact support
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
