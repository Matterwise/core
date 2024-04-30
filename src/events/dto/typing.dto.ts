import { IsNotEmpty } from 'class-validator';
import { BroadcastDto, EventDto } from './event.dto';
import { Channel } from 'src/channels/domain/channel';
import { Type } from 'class-transformer';

export class TypingBroadcastDto extends BroadcastDto {
  @IsNotEmpty()
  channel_id: Channel['id'];
}

export class TypingEventDto extends EventDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  typing: boolean;

  @IsNotEmpty()
  @Type(() => TypingBroadcastDto)
  broadcast: TypingBroadcastDto;
}
