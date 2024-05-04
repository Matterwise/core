import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../../../domain/message';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { ChannelEntity } from 'src/channels/infrastructure/persistence/entities/channel.entity';
import { FileType } from 'src/files/domain/file';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

@Entity({
  name: 'message',
})
export class MessageEntity extends EntityRelationalHelper implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  content: string;

  @Column({ default: 0 })
  childsCount: number;

  @Column({ default: false })
  draft: boolean;

  @ManyToOne(() => UserEntity)
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

  @ManyToOne(() => MessageEntity)
  parentMessage: MessageEntity;

  @ManyToMany(() => UserEntity, (user) => user.parentMessages)
  @JoinTable({
    name: 'thread_participants_user',
    joinColumn: {
      name: 'parentMessageId',
      referencedColumnName: 'parentMessage',
    },
    inverseJoinColumn: {
      name: 'participantId',
      referencedColumnName: 'id',
    },
  })
  participants: UserEntity[];

  @ManyToMany(() => FileEntity, (file) => file.messages)
  @JoinTable()
  files: FileType[];
}
