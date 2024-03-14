import { Injectable } from '@nestjs/common';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from 'src/utils/types/pagination-options';
import { User } from '../../../users/domain/user';

@Injectable()
export abstract class MessageRepository {
  abstract create(data: Message): Promise<Message>;

  abstract findMessagesWithCursorPagination(
    id: Channel['id'],
    paginationOptions: ICursorPaginationOptions,
  ): Promise<{ messages: Message[]; nextCursor: number | null }>;

  abstract findUserThreadsWithPagination(
    workspaceId: Channel['id'],
    userId: User['id'],
    query: IPaginationOptions,
  ): Promise<Message[]>;

  abstract unsubscribeThread(
    userId: User['id'],
    parentMessageId: Message['id'],
  ): Promise<void>;

  abstract subscribeThread(
    userId: User['id'],
    parentMessageId: Message['id'],
  ): Promise<void>;
}
