import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Channel } from 'src/channels/domain/channel';
import { Workspace } from 'src/workspaces/domain/workspace';
import { Message } from '../domain/message';
import { FileType } from 'src/files/domain/file';

export class CreateMessageDto {
  @ApiProperty({ example: 'New message' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ type: Channel })
  @IsNotEmpty()
  @Type(() => Channel)
  channel: Channel;

  @ApiProperty({
    type: Workspace,
  })
  @IsNotEmpty()
  @Type(() => Workspace)
  @ValidateNested()
  workspace: Workspace;

  @ApiProperty({
    type: Message,
  })
  @IsOptional()
  @Type(() => Message)
  @ValidateNested()
  parentMessage?: Message;

  @ApiProperty({
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  draft: boolean = false;

  @ApiProperty({
    type: [FileType],
  })
  @IsOptional()
  @Type(() => FileType)
  @ValidateNested({ each: true })
  files?: FileType[];
}
