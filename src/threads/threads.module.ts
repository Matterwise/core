import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  controllers: [ThreadsController],
  providers: [ThreadsService],
  imports: [UsersModule, MessagesModule, AiModule],
})
export class ThreadsModule {}
