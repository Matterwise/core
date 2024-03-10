import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from '../../../domain/channel';
import { ChannelTypeEntity } from '../../../../channel-types/infrastructure/persistence/relational/entities/channel-type.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from '../../../../workspaces/infrastructure/persistence/entities/workspace.entity';
import { MessageEntity } from '../../../../messages/infrastructure/presistence/entities/message.entity';
@Entity({
  name: 'channel',
})
export class ChannelEntity extends EntityRelationalHelper implements Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  owner: UserEntity;

  @Column({ type: String })
  title: string | null;

  @Column({ type: String, nullable: true })
  description: string | null;

  @ManyToOne(() => ChannelTypeEntity)
  type?: ChannelTypeEntity;

  @ManyToMany(() => UserEntity, (user) => user.channels, {
    eager: true,
  })
  @JoinTable()
  members: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.channels, {
    eager: true,
  })
  workspace: WorkspaceEntity;
}
