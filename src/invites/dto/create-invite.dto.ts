import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';

export class CreateInviteDto {
  @IsNotEmpty()
  @Type(() => Workspace)
  workspace: Workspace;

  @IsNotEmpty()
  @Type(() => User)
  invitee: User;

  @IsNotEmpty()
  @Type(() => User)
  sender: User;

  @IsNotEmpty()
  @IsDate()
  expireAfter: Date;
}
