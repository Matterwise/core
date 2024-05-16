import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from 'src/utils/types/pagination-options';
import { Channel } from 'src/channels/domain/channel';
import { User } from '../users/domain/user';
import { Message } from './domain/message';
import { Workspace } from '../workspaces/domain/workspace';
import { FilterMessageDto, SortMessageDto } from './dto/query-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async getMessagesWithCursorPagination({
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
    return await this.messageRepository.findMessagesWithCursorPagination({
      channelId,
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findUserThreadsWithPagination(
    workspaceId: Workspace['id'],
    userId: User['id'],
    query: IPaginationOptions,
  ): Promise<Message[]> {
    return this.messageRepository.findUserThreadsWithPagination(
      workspaceId as number,
      userId,
      query,
    );
  }

  async unsubscribeThread(userId: User['id'], parentMessageId: Message['id']) {
    return this.messageRepository.unsubscribeThread(userId, parentMessageId);
  }

  async subscribeThread(userId: User['id'], parentMessageId: Message['id']) {
    return this.messageRepository.subscribeThread(userId, parentMessageId);
  }

  async createMessage(
    user: User,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const clonedPayload = {
      sender: user,
      ...createMessageDto,
    };

    return this.messageRepository.create(clonedPayload);
  }

  async getMessageById(id: Message['id']): Promise<Message> {
    const message = await this.messageRepository.findOne({ id });

    if (!message) {
      throw new NotFoundException();
    }

    return message;
  }

  async updateMessage(
    user: User,
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({ id });

    if (!message) {
      throw new NotFoundException();
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.messageRepository.update(id, payload);
  }

  async softDelete(user: User, id: Message['id']): Promise<any> {
    const message = await this.messageRepository.findOne({ id });

    if (!message) {
      throw new NotFoundException();
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException();
    }

    return await this.messageRepository.softRemove(message);
  }
}
