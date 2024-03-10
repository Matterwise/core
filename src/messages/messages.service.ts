import { Injectable } from '@nestjs/common';
import { MessageRepository } from './infrastructure/presistence/message.repository';
import { ICursorPaginationOptions } from 'src/utils/types/pagination-options';
import { Channel } from 'src/channels/domain/channel';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async getMessagesWithCursorPagination(
    channelId: Channel['id'],
    paginationOptions: ICursorPaginationOptions,
  ) {
    return await this.messageRepository.findMessagesWithCursorPagination(
      channelId,
      paginationOptions,
    );
  }
}
