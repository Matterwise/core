import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { EventReplyDto } from './dto/event-reply.dto';
import { MessageDeletedDto } from './dto/message-deleted.dto';
import { MessageSentDto } from './dto/message-sent.dto';
import { MessageUpdatedDto } from './dto/message-updated.dto';
import { RoomType } from './enums/room-type.enum';

@Injectable()
export class MessagesEventService {
  constructor(private readonly messagesService: MessagesService) {}
  async messageSent(
    client: any,
    payload: MessageSentDto,
  ): Promise<EventReplyDto> {
    const message = await this.messagesService.createMessage(
      client.user,
      payload.data,
    );

    if (!message) {
      return {
        status: 'FAILED',
        error: {
          id: '500',
          message: 'Internal Server Error',
        },
        seq_reply: payload.seq,
      };
    }

    client
      .to(RoomType.Channel + message.channel.id)
      .emit(payload.event, message);

    return {
      status: 'OK',
      data: { message },
      seq_reply: payload.seq,
    };
  }

  async messageDeleted(
    client: any,
    payload: MessageDeletedDto,
  ): Promise<EventReplyDto> {
    await this.messagesService.softDelete(client.user, payload.id);

    const deletedMessage = {
      id: payload.id,
      channelId: payload.broadcast.channel_id,
    };

    client
      .to(RoomType.Channel + payload.broadcast.channel_id)
      .emit(payload.event, deletedMessage);

    return {
      status: 'OK',
      data: {
        message_id: payload.id,
        message: 'Message successfully deleted',
      },
      seq_reply: payload.seq,
    };
  }
  async messageUpdated(
    client: any,
    payload: MessageUpdatedDto,
  ): Promise<EventReplyDto> {
    const message = await this.messagesService.updateMessage(
      client.user,
      payload.id,
      payload.data,
    );

    if (!message) {
      return {
        status: 'FAILED',
        error: {
          id: '500',
          message: 'Internal Server Error',
        },
        seq_reply: payload.seq,
      };
    }

    client
      .to(RoomType.Channel + message.channel.id)
      .emit(payload.event, message);

    return {
      status: 'OK',
      data: { message },
      seq_reply: payload.seq,
    };
  }
}
