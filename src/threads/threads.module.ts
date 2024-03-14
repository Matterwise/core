import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  controllers: [ThreadsController],
  providers: [ThreadsService],
  imports: [UsersModule, MessagesModule],
})
export class ThreadsModule {}
