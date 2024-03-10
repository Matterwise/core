import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadParticipantEntity } from 'src/thread-participants/infrastructure/persistence/relational/entities/thread-participant.entity';
import { ThreadSeedService } from './thread-participant-seed.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { MessageEntity } from 'src/messages/infrastructure/presistence/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThreadParticipantEntity,
      UserEntity,
      MessageEntity,
    ]),
  ],
  providers: [ThreadSeedService],
  exports: [ThreadSeedService],
})
export class ThreadParticipantSeedModule {}
