import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagePersistenceModule } from './infrastructure/persistence/persistence.module';
import { MessageSubscriber } from './infrastructure/persistence/subscribers/message.subscriber';

@Module({
  imports: [MessagePersistenceModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageSubscriber],
  exports: [MessagesService],
})
export class MessagesModule {}
