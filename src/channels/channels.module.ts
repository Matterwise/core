import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChannelPersistenceModule } from './infrastructure/persistence/persistence.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from '../users/users.module';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Module({
  imports: [ChannelPersistenceModule, MessagesModule, UsersModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, CaslAbilityFactory],
  exports: [ChannelsService],
})
export class ChannelsModule {}
