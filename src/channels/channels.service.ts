import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChannelRepository } from './infrastructure/persistence/channel.repository';
import { User } from 'src/users/domain/user';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from './domain/channel';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelRepostory: ChannelRepository) {}

  async createChannel(user: User, createChannelDto: CreateChannelDto) {
    createChannelDto.members
      ? createChannelDto.members.push(user)
      : (createChannelDto.members = [user]);

    const clonedPayload = {
      owner: user,
      ...createChannelDto,
    };

    return this.channelRepostory.create(clonedPayload);
  }

  async getChannelById(user: User, id: Channel['id']) {
    const channel = await this.channelRepostory.findOne({ id });

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (!channel.members.find((member) => member.id === user.id)) {
      throw new ForbiddenException();
    }

    return channel;
  }

  async getChannelUsers(user: User, id: Channel['id']) {
    const channel = await this.channelRepostory.findOne({ id });
    if (!channel) {
      throw new NotFoundException();
    }

    if (!channel.members.find((member) => member.id === user.id)) {
      throw new ForbiddenException();
    }

    return await this.channelRepostory.getChannelUsers(id);
  }

  async softDelete(user: User, id: Channel['id']): Promise<void> {
    const channel = await this.channelRepostory.findOne({ id });
    if (!channel) {
      throw new NotFoundException();
    }

    if (channel.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.channelRepostory.softDelete(id);
  }
}
