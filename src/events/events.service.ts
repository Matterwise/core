import { Injectable } from '@nestjs/common';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { ChannelsService } from 'src/channels/channels.service';
import { MessagesService } from 'src/messages/messages.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { EventReplyDto } from './dto/event-reply.dto';
import { MessageSentDto } from './dto/message-sent.dto';
import { RoomType } from './enums/room-type.enum';
import { MessageUpdatedDto } from './dto/message-updated.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly channelsService: ChannelsService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleSubscribe(
    client: any,
    payload: SubscribeDto,
  ): Promise<EventReplyDto> {
    const handlers = {
      [RoomType.Workspace]: async () =>
        this.handleWorkspaceSubscribe(client, payload),
      [RoomType.Channel]: async () =>
        this.handleChannelSubscribe(client, payload),
      [RoomType.User]: async () => this.handleUserSubscribe(client, payload),
    };

    const handler = handlers[payload.data.room_type];
    if (!handler) {
      throw new Error('Invalid room type');
    }

    return handler();
  }

  async handleMessageSent(
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

    client.to('channel' + message.channel.id).emit('message_sent', message);

    return {
      status: 'OK',
      data: { message },
      seq_reply: payload.seq,
    };
  }

  async handleMessageUpdated(
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

    client.to('channel' + message.channel.id).emit('message_updated', message);

    return {
      status: 'OK',
      data: { message },
      seq_reply: payload.seq,
    };
  }

  private async handleWorkspaceSubscribe(
    client: any,
    payload: SubscribeDto,
  ): Promise<EventReplyDto> {
    const workspace = await this.workspacesService.checkUserMembership(
      payload.data.room_id,
      client.user.id,
    );

    if (!workspace) {
      return {
        status: 'FAILED',
        error: {
          id: '404',
          message: 'Forbidden',
        },
        seq_reply: payload.seq,
      };
    }

    payload.data.room_id = RoomType.Workspace + payload.data.room_id;
    client.join(payload.data.room_id);

    return {
      status: 'OK',
      data: {
        room_id: payload.data.room_id,
        message: 'Subscribed',
      },
      seq_reply: payload.seq,
    };
  }

  private async handleChannelSubscribe(
    client: any,
    payload: SubscribeDto,
  ): Promise<EventReplyDto> {
    const channel = await this.channelsService.checkUserMembership(
      payload.data.room_id,
      client.user.id,
    );

    if (!channel) {
      return {
        status: 'FAILED',
        error: {
          id: '404',
          message: 'Forbidden',
        },
        seq_reply: payload.seq,
      };
    }

    payload.data.room_id = RoomType.Channel + payload.data.room_id;
    client.join(payload.data.room_id);

    return {
      status: 'OK',
      data: {
        room_id: payload.data.room_id,
        message: 'Subscribed',
      },
      seq_reply: payload.seq,
    };
  }

  private handleUserSubscribe(
    client: any,
    payload: SubscribeDto,
  ): Promise<EventReplyDto> {
    payload.data.room_id = RoomType.User + payload.data.room_id;
    client.join(payload.data.room_id);

    return Promise.resolve({
      status: 'OK',
      data: {
        room_id: payload.data.room_id,
        message: 'Subscribed',
      },
      seq_reply: payload.seq,
    });
  }
}
