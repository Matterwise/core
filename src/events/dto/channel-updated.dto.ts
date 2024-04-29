import { IsNotEmpty, ValidateNested } from 'class-validator';
import { EventDto } from './event.dto';
import { UpdateChannelDto } from 'src/channels/dto/update-channel.dto';
import { Channel } from 'src/channels/domain/channel';

export class ChannelUpdatedDto extends EventDto {
  @IsNotEmpty()
  id: Channel['id'];

  @IsNotEmpty()
  @ValidateNested()
  data: UpdateChannelDto;
}
