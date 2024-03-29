import { Channel } from 'src/channels/domain/channel';
import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';

export class Message {
  id: number | string;
  content: string;
  childsCount: number;
  sender: User;
  channel: Channel;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  workspace: Workspace;
  parentMessage?: Message;
  participants: User[];
  draft: boolean;
}
