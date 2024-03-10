import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChannelPersistenceModule } from './infrastructure/persistence/persistence.module';
import { WorkspacePersistenceModule } from 'src/workspaces/infrastructure/persistence/persistence.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ChannelPersistenceModule,
    WorkspacePersistenceModule,
    MessagesModule,
    UsersModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
