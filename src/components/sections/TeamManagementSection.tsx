
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Mail, Crown, Shield, User, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  hourlyRate: number;
  department: string;
  avatar?: string;
  totalMeetings: number;
  totalCost: number;
  totalHours: number;
  status: 'active' | 'inactive';
}

interface TeamManagementSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

export function TeamManagementSection({ onUpgrade, isUpgrading }: TeamManagementSectionProps) {
  const { subscription } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Mock data - in real app this would come from API
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'admin',
      hourlyRate: 150,
      department: 'Engineering',
      totalMeetings: 45,
      totalCost: 6750,
      totalHours: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'manager',
      hourlyRate: 120,
      department: 'Product',
      totalMeetings: 32,
      totalCost: 3840,
      totalHours: 32,
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'member',
      hourlyRate: 95,
      department: 'Design',
      totalMeetings: 28,
      totalCost: 2660,
      totalHours: 28,
      status: 'active'
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      role: 'member',
      hourlyRate: 110,
      department: 'Engineering',
      totalMeetings: 38,
      totalCost: 4180,
      totalHours: 38,
      status: 'active'
    }
  ]);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRole === 'all' || member.role === filterRole) &&
    (filterDepartment === 'all' || member.department === filterDepartment)
  );

  const totalTeamCost = filteredMembers.reduce((sum, member) => sum + member.totalCost, 0);
  const totalMeetings = filteredMembers.reduce((sum, member) => sum + member.totalMeetings, 0);
  const avgCostPerMember = filteredMembers.length > 0 ? totalTeamCost / filteredMembers.length : 0;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'manager': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (subscription.tier !== 'enterprise') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage team members and collaboration</p>
        </div>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Enterprise Team Management</h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Enterprise to manage team members, set hourly rates, track individual costs, and analyze team productivity.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Add unlimited team members
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Set custom hourly rates per person
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Track individual meeting costs and productivity
                </div>
              </div>
              <Button 
                onClick={() => onUpgrade('enterprise')}
                disabled={isUpgrading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Enterprise - $99/month'}
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
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600 mt-2">Manage team members and track meeting costs</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold">{filteredMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">${totalTeamCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Meetings</p>
                <p className="text-2xl font-bold">{totalMeetings}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Cost/Member</p>
                <p className="text-2xl font-bold">${avgCostPerMember.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and track individual meeting costs</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <Badge className={getRoleColor(member.role)}>
                          {getRoleIcon(member.role)}
                          <span className="ml-1 capitalize">{member.role}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </div>
                        <div>
                          {member.department}
                        </div>
                        <div>
                          ${member.hourlyRate}/hr
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{member.totalMeetings}</div>
                        <div className="text-xs text-gray-500">Meetings</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.totalHours}h</div>
                        <div className="text-xs text-gray-500">Hours</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">${member.totalCost}</div>
                        <div className="text-xs text-gray-500">Total Cost</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No team members found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
