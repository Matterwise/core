import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [AiService],
  imports: [MessagesModule],
  exports: [AiService],
})
export class AiModule {}
