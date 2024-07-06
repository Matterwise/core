import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagePersistenceModule } from 'src/messages/infrastructure/persistence/persistence.module';

@Module({
  providers: [AiService],
  imports: [MessagesModule, MessagePersistenceModule],
  exports: [AiService],
})
export class AiModule {}
