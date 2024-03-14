import { Message } from 'src/messages/domain/message';
import { MessageEntity } from '../entities/message.entity';
import { UserMapper } from 'src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { ChannelMapper } from 'src/channels/infrastructure/persistence/mappers/channel.mapper';
import { WorkspaceMapper } from 'src/workspaces/infrastructure/persistence/mappers/workspace.mapper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { ChannelEntity } from 'src/channels/infrastructure/persistence/entities/channel.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const message = new Message();
    message.id = raw.id;
    message.content = raw.content;
    message.createdAt = raw.createdAt;
    message.updatedAt = raw.updatedAt;
    message.deletedAt = raw.deletedAt;
    message.sender = UserMapper.toDomain(raw.sender);
    message.channel = ChannelMapper.toDomain(raw.channel);
    message.workspace = WorkspaceMapper.toDomain(raw.workspace);
    if (raw.parentMessage) {
      message.parentMessage = MessageMapper.toDomain(raw.parentMessage);
    }

    return message;
  }

  static toPersistence(message: Message): MessageEntity {
    const messageEntity = new MessageEntity();
    messageEntity.id = message.id as number;
    messageEntity.content = message.content;
    messageEntity.createdAt = message.createdAt;
    messageEntity.updatedAt = message.updatedAt;
    messageEntity.deletedAt = message.deletedAt;

    const userEntity = new UserEntity();
    userEntity.id = Number(message.sender.id);
    messageEntity.sender = userEntity;

    const channelEntity = new ChannelEntity();
    channelEntity.id = Number(message.channel.id);
    messageEntity.channel = channelEntity;

    const workspaceEntity = new WorkspaceEntity();
    workspaceEntity.id = Number(message.workspace.id);
    messageEntity.workspace = workspaceEntity;

    if (message.parentMessage) {
      const parentMessageEntity = new MessageEntity();
      parentMessageEntity.id = message.parentMessage.id as number;
      messageEntity.parentMessage = parentMessageEntity;
    }

    return messageEntity;
  }
}
