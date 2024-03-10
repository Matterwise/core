import { User } from '../../users/domain/user';
import { ChannelType } from '../../channel-types/domain/channel-type';
import { Workspace } from '../../workspaces/domain/workspace';
import { Message } from '../../messages/domain/message';

export class Channel {
  id: number;

  owner: User;

  title: string | null;

  description: string | null;

  type?: ChannelType;

  members: User[];

  messages: Message[];

  workspace: Workspace;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
