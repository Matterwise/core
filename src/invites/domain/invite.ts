import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';

export class Invite {
  id: number;
  workspace: Workspace;
  invitee: User;
  sender: User;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'declined';
}
