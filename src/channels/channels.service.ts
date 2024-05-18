import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ChannelRepository } from './infrastructure/persistence/channel.repository';
import { User } from 'src/users/domain/user';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from './domain/channel';
import { FilterUserDto, SortUserDto } from '../users/dto/query-user.dto';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from '../utils/types/pagination-options';
import { UsersService } from '../users/users.service';
import { Message } from '../messages/domain/message';
import { MessagesService } from '../messages/messages.service';
import {
  FilterMessageDto,
  SortMessageDto,
} from 'src/messages/dto/query-message.dto';
import { FilterChannelDto, SortChannelDto } from './dto/query-channel.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/casl/action.enum';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelRepostory: ChannelRepository,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
      throw new NotFoundException();
    }

    const isMember = await this.channelRepostory.checkUserMembership(
      channel.id,
      user.id,
    );
    if (!isMember) {
      throw new ForbiddenException();
    }

    return channel;
  }

  async update(
    user: User,
    id: Channel['id'],
    payload: Partial<Channel>,
  ): Promise<Channel | null> {
    const channel = await this.channelRepostory.findOne({ id });
    if (!channel) {
      throw new NotFoundException();
    }

    if (channel.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.channelRepostory.update(id, payload);
  }

  async getChannelUsers({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersService.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async checkUserMembership(workspaceId: Channel['id'], memberId: User['id']) {
    return this.channelRepostory.checkUserMembership(workspaceId, memberId);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterChannelDto | null;
    sortOptions?: SortChannelDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Channel[]> {
    return this.channelRepostory.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async addUsersToChannel(
    channelId: Channel['id'],
    users: User[],
  ): Promise<{ addedUsers: User[]; duplicateUsers: User[] }> {
    const addedUsers: User[] = [];
    const duplicateUsers: User[] = [];
    const usersToAddPromises = users.map(async (user) => {
      try {
        await this.channelRepostory.addUser(channelId, user);
        addedUsers.push(user);
      } catch (error) {
        duplicateUsers.push(user);
        Logger.error(error);
      }
    });

    await Promise.all(usersToAddPromises);
    return { addedUsers, duplicateUsers };
  }

  async softDelete(user: User, id: Channel['id']): Promise<void> {
    const channel = await this.channelRepostory.findOne({ id });
    if (!channel) {
      throw new NotFoundException();
    }

    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.cannot(Action.Delete, channel)) {
      throw new ForbiddenException();
    }

    await this.channelRepostory.softDelete(id);
  }

  getMessagesWithCursorPagination({
    channelId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    channelId: Channel['id'];
    filterOptions?: FilterMessageDto | null;
    sortOptions?: SortMessageDto[] | null;
    paginationOptions: ICursorPaginationOptions;
  }): Promise<{ messages: Message[]; nextCursor: number | null }> {
    return this.messagesService.getMessagesWithCursorPagination({
      channelId,
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
