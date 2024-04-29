import { User } from '../../users/domain/user';
import { ChannelType } from '../../channel-types/domain/channel-type';
import { Workspace } from '../../workspaces/domain/workspace';
import { Message } from '../../messages/domain/message';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class Channel {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number | string;

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
