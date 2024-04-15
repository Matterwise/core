import { Injectable } from '@nestjs/common';
import { InviteRepository } from '../invite.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { InviteEntity } from '../entities/invite.entity';
import { InviteMapper } from '../mappers/invite.mapper';
import { Repository } from 'typeorm';
import { Invite } from 'src/invites/domain/invite';

@Injectable()
export class InviteRelationalRepository implements InviteRepository {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
  ) {}

  async create(data: Invite): Promise<Invite> {
    const persistenceModel = InviteMapper.toPersistence(data);
    const newEntity = await this.inviteRepository.save(
      this.inviteRepository.create(persistenceModel),
    );
    return InviteMapper.toDomain(newEntity);
  }
}
