import { useOrgMembers, useOrganization } from '@/hooks/useSettings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, Crown, Shield, User } from 'lucide-react';

export function TeamSettings() {
  const { data: organization, isLoading: orgLoading } = useOrganization();
  const { data: members = [], isLoading: membersLoading } = useOrgMembers();

  const isLoading = orgLoading || membersLoading;

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <Crown className="w-3 h-3" />;
      case 'moderator':
        return <Shield className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team
            </CardTitle>
            <CardDescription>
              {organization?.name ? `${organization.name} team members` : 'Manage your team'}
            </CardDescription>
          </div>
          <Button size="sm" disabled>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Invite team members to collaborate on your startup
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => {
              const user = member.user as any;
              const initials = user?.full_name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase() || 'U';

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="bg-sage text-sage-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user?.full_name || 'Unknown'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                    {getRoleIcon(member.role)}
                    {member.role || 'member'}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Team invitations coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
