import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Workspace } from '../../../domain/workspace';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { ChannelEntity } from '../../../../channels/infrastructure/persistence/entities/channel.entity';
import { InviteEntity } from 'src/invites/infrastructure/entities/invite.entity';

@Entity({
  name: 'workspace',
})
export class WorkspaceEntity
  extends EntityRelationalHelper
  implements Workspace
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  title: string | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  owner: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.workspaces)
  @JoinTable()
  members: UserEntity[];

  @OneToMany(() => InviteEntity, (invite) => invite.workspace)
  invites: InviteEntity[];

  @OneToMany(() => ChannelEntity, (channel) => channel.workspace)
  channels: ChannelEntity[];

  @Column({ type: String, nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
