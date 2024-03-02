import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { Channel } from 'src/channels/domain/channel';
import { FileType } from 'src/files/domain/file';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';
import { Workspace } from 'src/workspaces/domain/workspace';

export class User {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Expose({ groups: ['me', 'admin'] })
  username: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  channels: Channel[];
  photo?: FileType | null;
  role?: Role | null;
  status?: Status;
  workspaces: Workspace[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
