import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadSeedService } from './thread-participant-seed.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { MessageEntity } from 'src/messages/infrastructure/presistence/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MessageEntity])],
  providers: [ThreadSeedService],
  exports: [ThreadSeedService],
})
export class ThreadParticipantSeedModule {}
