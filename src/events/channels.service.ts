import { Injectable } from '@nestjs/common';
import { ChannelsService } from 'src/channels/channels.service';
import { ChannelDeletedDto } from './dto/channel-deleted.dto';
import { EventReplyDto } from './dto/event-reply.dto';
import { Events } from './enums/events.enum';
import { ChannelCreatedDto } from './dto/channel-created.dto';

@Injectable()
export class ChannelsEventService {
  constructor(private readonly channelsService: ChannelsService) {}
  async channelCreated(
    client: any,
    payload: ChannelCreatedDto,
  ): Promise<EventReplyDto> {
    const channel = await this.channelsService.createChannel(
      client.user,
      payload.data,
    );

    if (!channel) {
      return {
        status: 'FAILED',
        error: {
          id: '500',
          message: 'Internal Server Error',
        },
        seq_reply: payload.seq,
      };
    }

    client.to('channel' + channel.id).emit(Events.CHANNEL_CREATED, channel);

    return {
      status: 'OK',
      data: { channel },
      seq_reply: payload.seq,
    };
  }

  async channelDeleted(
    client: any,
    payload: ChannelDeletedDto,
  ): Promise<EventReplyDto> {
    await this.channelsService.softDelete(client.user, payload.id);

    const channelDeleted = {
      id: payload.id,
      workspaceId: payload.broadcast.workspace_id,
    };

    client
      .to('channel' + payload.id)
      .emit(Events.CHANNEL_DELETED, channelDeleted);

    return {
      status: 'OK',
      seq_reply: payload.seq,
      data: {
        channel_id: payload.id,
        message: 'Channel successfully deleted',
      },
    };
  }
}
