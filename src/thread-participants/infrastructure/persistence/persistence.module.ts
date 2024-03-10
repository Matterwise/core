import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadParticipantEntity } from './relational/entities/thread-participant.entity';
import { ThreadParticipantRepository } from './relational/thread-participant.repository';
import { ThreadParticipantRelationalRepository } from './relational/repositories/thread-participant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThreadParticipantEntity])],
  providers: [
    {
      provide: ThreadParticipantRepository,
      useClass: ThreadParticipantRelationalRepository,
    },
  ],
  exports: [ThreadParticipantRepository],
})
export class RelationalThreadPersistenceModule {}
