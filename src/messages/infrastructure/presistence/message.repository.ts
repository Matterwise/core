import { Injectable } from '@nestjs/common';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import { ICursorPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export abstract class MessageRepository {
  abstract create(data: Message): Promise<Message>;

  abstract findMessagesWithCursorPagination(
    id: Channel['id'],
    paginationOptions: ICursorPaginationOptions,
  ): Promise<{ messages: Message[]; nextCursor: number | null }>;
}
