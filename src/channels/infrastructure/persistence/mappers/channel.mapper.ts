import { Channel } from 'src/channels/domain/channel';
import { ChannelEntity } from 'src/channels/infrastructure/persistence/entities/channel.entity';
import { UserMapper } from 'src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { WorkspaceMapper } from 'src/workspaces/infrastructure/persistence/mappers/workspace.mapper';
import { ChannelTypeEntity } from 'src/channel-types/infrastructure/persistence/relational/entities/channel-type.entity';

export class ChannelMapper {
  static toDomain(raw: ChannelEntity): Channel {
    const channel = new Channel();
    channel.id = raw.id;
    channel.title = raw.title;
    channel.description = raw.description;
    if (raw.owner) {
      channel.owner = UserMapper.toDomain(raw.owner);
    }
    channel.type = raw.type;
    if (raw.workspace) {
      channel.workspace = WorkspaceMapper.toDomain(raw.workspace);
    }
    channel.members = raw.members;
    channel.createdAt = raw.createdAt;
    channel.updatedAt = raw.updatedAt;
    channel.deletedAt = raw.deletedAt;
    return channel;
  }

  static toPersistence(channel: Channel): ChannelEntity {
    const owner = new UserEntity();
    owner.id = Number(channel.owner.id);

    const members = channel.members?.map((member) => {
      const user = new UserEntity();
      user.id = Number(member.id);
      return user;
    });

    const workspace = new WorkspaceEntity();
    if (channel.workspace) {
      workspace.id = Number(channel.workspace.id);
    }

    const channelEntity = new ChannelEntity();
    if (channel.id && typeof channel.id === 'number') {
      channelEntity.id = channel.id;
    }

    const type = new ChannelTypeEntity();
    if (channel.type) {
      type.id = channel.type.id;
    }
    channelEntity.title = channel.title;
    channelEntity.description = channel.description;
    channelEntity.owner = owner;
    channelEntity.workspace = workspace;
    channelEntity.members = members;
    channelEntity.type = type;
    channelEntity.createdAt = channel.createdAt;
    channelEntity.updatedAt = channel.updatedAt;
    channelEntity.deletedAt = channel.deletedAt;
    return channelEntity;
  }
}
