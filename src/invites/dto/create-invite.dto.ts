import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';

export class CreateInviteDto {
  @ApiProperty({ example: 'workspace' })
  @IsNotEmpty()
  @Type(() => Workspace)
  workspace: Workspace;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @Type(() => User)
  invitee: User;

  @ApiProperty({ example: Date.now() })
  @IsNotEmpty()
  @IsDate()
  expireAfter: Date;
}
