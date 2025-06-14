
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, Settings, Mail, Crown, Building, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TeamManagementSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

const TeamManagementSection = ({ onUpgrade, isUpgrading }: TeamManagementSectionProps) => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  
  const isEnterprise = subscription.tier === 'enterprise';

  const handleInviteMember = () => {
    if (!isEnterprise) {
      toast({
        title: "Enterprise Feature",
        description: "Team management requires an enterprise subscription.",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation Sent",
      description: `Team invitation sent to ${newMemberEmail}`,
    });
    
    setNewMemberEmail("");
    setNewMemberRole("member");
  };

  const handleRemoveMember = (memberName: string) => {
    if (!isEnterprise) {
      toast({
        title: "Enterprise Feature",
        description: "Team management requires an enterprise subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Member Removed",
      description: `${memberName} has been removed from the team.`,
    });
  };

  const handleChangeRole = (memberName: string, newRole: string) => {
    if (!isEnterprise) {
      toast({
        title: "Enterprise Feature",
        description: "Team management requires an enterprise subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role Updated",
      description: `${memberName}'s role has been changed to ${newRole}.`,
    });
  };

  // Sample team data
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      role: "admin",
      avatar: "/placeholder.svg",
      status: "active",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "manager",
      avatar: "/placeholder.svg",
      status: "active",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@company.com",
      role: "member",
      avatar: "/placeholder.svg",
      status: "pending",
      lastActive: "Never"
    }
  ];

  if (!isEnterprise) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 gradient-text">Team Management</h1>
            <p className="text-gray-600 mt-2">Manage team members and permissions</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            <Crown className="h-3 w-3 mr-1" />
            Enterprise Feature
          </Badge>
        </div>

        <div className="grid gap-6">
          <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unlock Team Management
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Invite team members, manage roles and permissions, and collaborate on meeting optimization
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => onUpgrade('enterprise')}
                  disabled={isUpgrading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                >
                  {isUpgrading ? "Processing..." : "Upgrade to Enterprise"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your team members and their access</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <Shield className="h-3 w-3 mr-1" />
          Enterprise
        </Badge>
      </div>

      {/* Invite New Member */}
      <Card className="shadow-lg border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Add new members to your team and assign their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleInviteMember}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-700" />
            Team Members ({teamMembers.length})
          </CardTitle>
          <CardDescription>
            Manage your team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {member.status}
                  </Badge>
                  <Select 
                    value={member.role} 
                    onValueChange={(value) => handleChangeRole(member.name, value)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-700" />
            Role Permissions
          </CardTitle>
          <CardDescription>
            Understand what each role can do in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Member</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• View meeting analytics</li>
                <li>• Create and track meetings</li>
                <li>• Export personal data</li>
                <li>• Basic reporting access</li>
              </ul>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3">Manager</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• All Member permissions</li>
                <li>• View team analytics</li>
                <li>• Manage department settings</li>
                <li>• Advanced reporting</li>
                <li>• Cost optimization tools</li>
              </ul>
            </div>
            <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-purple-900 mb-3">Admin</h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• All Manager permissions</li>
                <li>• Invite/remove team members</li>
                <li>• Manage roles and permissions</li>
                <li>• Organization-wide analytics</li>
                <li>• Billing and subscription management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagementSection;
