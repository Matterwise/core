import { Injectable } from '@nestjs/common';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from 'src/utils/types/pagination-options';
import { User } from '../../../users/domain/user';
import { Workspace } from 'src/workspaces/domain/workspace';
import {
  FilterMessageDto,
  SortMessageDto,
} from 'src/messages/dto/query-message.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

@Injectable()
export abstract class MessageRepository {
  abstract create(
    data: Omit<
      Message,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'childsCount'
      | 'participants'
    >,
  ): Promise<Message>;

  abstract findOne(
    fields: EntityCondition<Message>,
  ): Promise<NullableType<Message>>;

  abstract softRemove(message: Message): Promise<any>;

  abstract update(
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<Message>;

  abstract findMessagesWithCursorPagination({
    channelId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    channelId: Channel['id'];
    filterOptions?: FilterMessageDto | null;
    sortOptions?: SortMessageDto[] | null;
    paginationOptions: ICursorPaginationOptions;
  }): Promise<{ messages: Message[]; nextCursor: number | null }>;

  abstract findUserThreadsWithPagination(
    workspaceId: Workspace['id'],
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
