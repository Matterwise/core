import { User } from '../../users/domain/user';
import { ChannelType } from '../../channel-types/domain/channel-type';
import { Workspace } from '../../workspaces/domain/workspace';

export class Channel {
  id: number;

  owner: User;

  title: string | null;

  description: string | null;

  type?: ChannelType;

  members: User[];

  workspace: Workspace;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
