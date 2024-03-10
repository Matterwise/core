import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../../../domain/message';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { ChannelEntity } from 'src/channels/infrastructure/persistence/entities/channel.entity';

@Entity({
  name: 'message',
})
export class MessageEntity extends EntityRelationalHelper implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  content: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  sender: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.messages)
  channel: ChannelEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => WorkspaceEntity)
  workspace: WorkspaceEntity;

  @ManyToOne(() => MessageEntity, { nullable: true })
  parentMessage: MessageEntity;
}
