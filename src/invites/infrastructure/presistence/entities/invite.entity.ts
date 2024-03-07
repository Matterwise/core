import { Invite } from 'src/invites/domain/invite';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'invite',
})
export class InviteEntity extends EntityRelationalHelper implements Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkspaceEntity, (Workspace) => Workspace.invites)
  workspace: WorkspaceEntity;

  @ManyToOne(() => UserEntity)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.invitesReceived)
  invitee: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'expired', 'declined'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'expired' | 'declined';
}
