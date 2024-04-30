import {
  Injectable,
  UseGuards,
  UsePipes,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/ws-jwt-auth/ws-jwt-auth.guard';
import { SocketAuthMiddleware } from 'src/auth/ws-jwt-auth/ws-jwt.middleware';
import { AllConfigType } from 'src/config/config.type';
import { Socket } from 'socket.io';
import { MessageSentDto } from './dto/message-sent.dto';
import { EventReplyDto } from './dto/event-reply.dto';
import { SubscriptionDto } from './dto/subscribe.dto';
import { WsCatchAllFilter } from './exceptions/ws-catch-all';
import { MessageDeletedDto } from './dto/message-deleted.dto';
import { MessageUpdatedDto } from './dto/message-updated.dto';
import { Events } from './enums/events.enum';
import { ChannelCreatedDto } from './dto/channel-created.dto';
import { MessagesEventService } from './messages.service';
import { SubscriptionEventsService } from './subscriptions.service';
import { ChannelsEventService } from './channels.service';
import { ChannelDeletedDto } from './dto/channel-deleted.dto';
import { WorkspaceUpdatedDto } from './dto/workspace-updated.dto';
import { WorkspacesEventService } from './workspaces.service';
import { ChannelUpdatedDto } from './dto/channel-updated.dto';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@UseGuards(WsJwtAuthGuard)
@Injectable()
export class EventsGateway {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly messagesService: MessagesEventService,
    private readonly subscriptionService: SubscriptionEventsService,
    private readonly channelsService: ChannelsEventService,
    private readonly workspacesService: WorkspacesEventService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware(this.configService) as any);
  }

  @SubscribeMessage(Events.SUBSCRIBE)
  async subscribe(
    client: any,
    payload: SubscriptionDto,
  ): Promise<EventReplyDto> {
    return this.subscriptionService.subscribe(client, payload);
  }

  @SubscribeMessage(Events.UNSUBSCRIBE)
  async unsubscribe(
    client: any,
    payload: SubscriptionDto,
  ): Promise<EventReplyDto> {
    return this.subscriptionService.unsubscribe(client, payload);
  }

  @SubscribeMessage(Events.MESSAGE_SENT)
  async messageSent(
    client: any,
    payload: MessageSentDto,
  ): Promise<EventReplyDto> {
    return this.messagesService.messageSent(client, payload);
  }

  @SubscribeMessage(Events.MESSAGE_DELETED)
  async messageDeleted(
    client: any,
    payload: MessageDeletedDto,
  ): Promise<EventReplyDto> {
    return this.messagesService.messageDeleted(client, payload);
  }

  @SubscribeMessage(Events.MESSAGE_UPDATED)
  async messageUpdated(
    client: any,
    payload: MessageUpdatedDto,
  ): Promise<EventReplyDto> {
    return this.messagesService.messageUpdated(client, payload);
  }

  @SubscribeMessage(Events.CHANNEL_DELETED)
  async channelDeleted(
    client: any,
    payload: ChannelDeletedDto,
  ): Promise<EventReplyDto> {
    return this.channelsService.channelDeleted(client, payload);
  }

  @SubscribeMessage(Events.CHANNEL_CREATED)
  async channelCreated(
    client: any,
    payload: ChannelCreatedDto,
  ): Promise<EventReplyDto> {
    return this.channelsService.channelCreated(client, payload);
  }

  @SubscribeMessage(Events.CHANNEL_UPDATED)
  async channelUpdated(
    client: any,
    payload: ChannelUpdatedDto,
  ): Promise<EventReplyDto> {
    return this.channelsService.channelUpdated(client, payload);
  }

  @SubscribeMessage(Events.WORKSPACE_UPDATED)
  async workspaceUpdated(
    client: any,
    payload: WorkspaceUpdatedDto,
  ): Promise<EventReplyDto> {
    return this.workspacesService.workspaceUpdated(client, payload);
  }
  @SubscribeMessage(Events.TYPING)
  async typing(client: any, payload: any): Promise<EventReplyDto> {
    return this.channelsService.typing(client, payload);
  }
}
