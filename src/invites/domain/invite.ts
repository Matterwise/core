import { InviteStatus } from 'src/inviteStatuses/domain/invite-status';
import { User } from 'src/users/domain/user';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Workspace } from 'src/workspaces/domain/workspace';

export class Invite {
  id: number | string;
  sender: User;
  invitee_email: string;
  workspace: DeepPartial<Workspace>;
  status: InviteStatus;
  createdAt: Date;
  updatedAt: Date;
}
