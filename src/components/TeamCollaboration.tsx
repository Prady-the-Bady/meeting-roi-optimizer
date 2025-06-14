
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Share2, MessageSquare, UserPlus, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  avatar?: string;
}

interface MeetingData {
  title: string;
  type: string;
  duration: number;
  participants: number;
  totalCost: number;
  costMethod: string;
  timestamp: Date;
}

interface TeamCollaborationProps {
  meetingData: MeetingData;
}

const TeamCollaboration = ({ meetingData }: TeamCollaborationProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'owner',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@company.com',
      role: 'admin',
      joinedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'member',
      joinedAt: new Date('2024-02-15')
    }
  ]);
  
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const inviteTeamMember = async () => {
    if (!newMemberEmail.trim()) return;
    
    setIsInviting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: 'member',
        joinedAt: new Date()
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
      setIsInviting(false);
      
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${newMemberEmail}`,
      });
    }, 1000);
  };

  const shareAnalysis = () => {
    const shareData = {
      title: `Meeting Analysis: ${meetingData.title}`,
      text: `Meeting cost analysis - $${meetingData.totalCost.toFixed(2)} for ${meetingData.participants} participants`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      toast({
        title: "Copied to Clipboard",
        description: "Meeting analysis has been copied to your clipboard.",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Star className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Team Collaboration
        </CardTitle>
        <CardDescription>
          Manage your team and share meeting insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Team Members */}
          <div>
            <h4 className="font-medium mb-3">Team Members ({teamMembers.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite New Member */}
          <div>
            <h4 className="font-medium mb-3">Invite Team Member</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                type="email"
              />
              <Button 
                onClick={inviteTeamMember}
                disabled={isInviting || !newMemberEmail.trim()}
                className="flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </div>
          </div>

          {/* Share Analysis */}
          <div>
            <h4 className="font-medium mb-3">Share Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                onClick={shareAnalysis}
                variant="outline"
                className="flex items-center justify-center"
                disabled={meetingData.duration === 0}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
              <Button 
                variant="outline"
                className="flex items-center justify-center"
                disabled={meetingData.duration === 0}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>

          {/* Team Insights */}
          {meetingData.duration > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Team Impact Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Meeting cost per team member: ${(meetingData.totalCost / teamMembers.length).toFixed(2)}</p>
                <p>Total team visibility: {teamMembers.length} members</p>
                <p>Collaboration efficiency: {teamMembers.length > 5 ? 'Consider smaller review groups' : 'Optimal team size'}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCollaboration;
