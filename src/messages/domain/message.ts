import { Channel } from 'src/channels/domain/channel';
import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';

export class Message {
  id: number;
  content: string;
  sender: User;
  channel: Channel;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  workspace: Workspace;
  parentMessage: Message;
}
