import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { MessagesEventService } from './messages.service';
import { SubscriptionEventsService } from './subscriptions.service';
import { ChannelsEventService } from './channels.service';
import { WorkspacesEventService } from './workspaces.service';

@Module({
  imports: [AuthModule, MessagesModule, WorkspacesModule, ChannelsModule],
  exports: [EventsGateway],
  providers: [
    EventsGateway,
    SubscriptionEventsService,
    MessagesEventService,
    ChannelsEventService,
    WorkspacesEventService,
  ],
})
export class EventsModule {}
