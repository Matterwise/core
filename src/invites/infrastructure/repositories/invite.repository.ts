import { Injectable } from '@nestjs/common';
import { InviteEntity } from '../entities/invite.entity';
import { Repository } from 'typeorm';
import { Invite } from 'src/invites/domain/invite';
import { InviteMapper } from '../mappers/invite.mapper';

@Injectable()
export class InviteRepository {
  constructor(private readonly inviteRepository: Repository<InviteEntity>) {}

  async create(data: Invite): Promise<Invite> {
    const presistenceModel = InviteMapper.toPersistence(data);
    const newEntity = await this.inviteRepository.save(
      this.inviteRepository.create(presistenceModel),
    );
    return InviteMapper.toDomain(newEntity);
  }

  async getInvite(id: Invite['id']): Promise<Invite> {
    const entity = await this.inviteRepository.findOne({
      where: {
        id: id,
      },
    });
    return InviteMapper.toDomain(entity);
  }

  async acceptInvite(id: Invite['id']): Promise<Invite> {
    const entity = await this.inviteRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!entity) {
      throw new Error('Invite not found');
    }

    if (entity.expiresAt < new Date()) {
      throw new Error('Invite expired');
    }
    entity.status = 'accepted';
    const updatedEntity = await this.inviteRepository.save(entity);
    return InviteMapper.toDomain(updatedEntity);
  }

  async declineInvite(id: Invite['id']): Promise<Invite> {
    const entity = await this.inviteRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!entity) {
      throw new Error('Invite not found');
    }
    entity.status = 'declined';
    const updatedEntity = await this.inviteRepository.save(entity);
    return InviteMapper.toDomain(updatedEntity);
  }

  async expireInvite(id: Invite['id']): Promise<Invite> {
    const entity = await this.inviteRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!entity) {
      throw new Error('Invite not found');
    }
    entity.status = 'expired';
    const updatedEntity = await this.inviteRepository.save(entity);
    return InviteMapper.toDomain(updatedEntity);
  }

  async cancelInvite(id: Invite['id']): Promise<Invite> {
    const entity = await this.inviteRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!entity) {
      throw new Error('Invite not found');
    }
    entity.status = 'expired';
    const updatedEntity = await this.inviteRepository.save(entity);
    return InviteMapper.toDomain(updatedEntity);
  }
}
