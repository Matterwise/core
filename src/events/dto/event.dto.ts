import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Channel } from 'src/channels/domain/channel';
import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';
import { Events } from '../enums/events.enum';

export class BroadcastDto {
  omit_users: User['id'][];

  user_id: User['id'];

  channel_id: Channel['id'];

  workspace_id: Workspace['id'];
}

export class EventDto {
  @IsNotEmpty()
  @IsNumber()
  seq: number;

  @IsNotEmpty()
  @IsEnum(Events)
  event: Events;

  @ValidateNested()
  @Type(() => BroadcastDto)
  broadcast: BroadcastDto;
}
