import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Channel } from 'src/channels/domain/channel';
import { Workspace } from 'src/workspaces/domain/workspace';
import { Message } from '../domain/message';
import { FileType } from 'src/files/domain/file';

export class CreateMessageDto {
  @ApiProperty({ example: 'New message' })
  @CustomConstraint()
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

export function CustomConstraint(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'customConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as CreateMessageDto;
          if (!value && (!dto.files || dto.files.length === 0)) {
            return false;
          }

          if (value && value instanceof String && value.trim().length > 0) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `A string ${args.property} is required when no files are provided.`;
        },
      },
    });
  };
}
