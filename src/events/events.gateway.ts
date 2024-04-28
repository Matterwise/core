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
import { SubscribeDto } from './dto/subscribe.dto';
import { WsCatchAllFilter } from './exceptions/ws-catch-all';
import { EventsService } from './events.service';
import { MessageUpdatedDto } from './dto/message-updated.dto';

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
    private readonly eventsService: EventsService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware(this.configService) as any);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    client: any,
    payload: SubscribeDto,
  ): Promise<EventReplyDto> {
    return this.eventsService.handleSubscribe(client, payload);
  }

  @SubscribeMessage('message_sent')
  async handleMessageSent(
    client: any,
    payload: MessageSentDto,
  ): Promise<EventReplyDto> {
    return this.eventsService.handleMessageSent(client, payload);
  }

  @SubscribeMessage('message_updated')
  async handleMessageUpdated(
    client: any,
    payload: MessageUpdatedDto,
  ): Promise<EventReplyDto> {
    return this.eventsService.handleMessageUpdated(client, payload);
  }
}
