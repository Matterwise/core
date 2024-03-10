import { Injectable } from '@nestjs/common';
import { ThreadParticipantRepository } from '../thread-participant.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadParticipantEntity } from '../entities/thread-participant.entity';
import { Repository } from 'typeorm';
import { ThreadMapper } from '../mappers/thread-participant.mapper';
import { ThreadParticipant } from '../../../../domain/thread-participant';

@Injectable()
export class ThreadParticipantRelationalRepository
  implements ThreadParticipantRepository
{
  constructor(
    @InjectRepository(ThreadParticipantEntity)
    private readonly ThreadRepository: Repository<ThreadParticipantEntity>,
  ) {}

  async create(data: ThreadParticipant): Promise<ThreadParticipant> {
    const persistenceModel = ThreadMapper.toPersistence(data);

    const newEntity = await this.ThreadRepository.save(
      this.ThreadRepository.create(persistenceModel),
    );

    return ThreadMapper.toDomain(newEntity);
  }
}
