import { Channel } from 'src/channels/domain/channel';
import { FileType } from 'src/files/domain/file';
import { User } from 'src/users/domain/user';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Workspace } from 'src/workspaces/domain/workspace';

export class Message {
  id: number | string;
  content?: string;
  childsCount: number;
  sender: DeepPartial<User>;
  channel: DeepPartial<Channel>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  workspace: DeepPartial<Workspace>;
  parentMessage?: Message;
  participants: User[];
  draft: boolean;
  files?: FileType[];
}
