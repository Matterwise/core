import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { InviteRepository } from './infrastructure/invite.repository';
import { Invite } from './domain/invite';
import { CreateInviteDto } from './dto/create-invite.dto';

/*
    - get invites for workspace
    - get invites for users  
*/
@Injectable()
export class InvitesService {
  constructor(private readonly inviteRepository: InviteRepository) {}

  createInvite(user: User, data: CreateInviteDto) {
    const isSenderWorkspaceOwner = data.workspace.owner.id === user.id;
    if (!isSenderWorkspaceOwner) {
      throw new Error('Only workspace owner can send invites');
    }

    const clonedPayload = {
      sender: user,
      ...data,
    };

    return this.inviteRepository.create(clonedPayload);
  }

  async getInvite(user: User, id: Invite['id']) {
    const invite = await this.inviteRepository.getInvite(id);
    if (invite.sender.id !== user.id && invite.invitee.id !== user.id) {
      throw new Error('User is not the sender or the invitee');
    }
    return this.inviteRepository.getInvite(id);
  }

  async acceptInvite(user: User, id: Invite['id']) {
    const invite = await this.inviteRepository.getInvite(id);
    if (invite.invitee.id !== user.id) {
      throw new Error('User is not the invitee');
    }

    if (invite.status !== 'pending') {
      throw new Error('Invite is not valid');
    }

    if (invite.expiresAt < new Date()) {
      await this.inviteRepository.expireInvite(id);
      throw new Error('Invite expired');
    }

    return this.inviteRepository.acceptInvite(id);
  }

  async declineInvite(user: User, id: Invite['id']) {
    const invite = await this.inviteRepository.getInvite(id);
    if (invite.invitee.id !== user.id) {
      throw new Error('User is not the invitee');
    }

    if (invite.status !== 'pending') {
      throw new Error('Invite is not valid');
    }

    if (invite.expiresAt < new Date()) {
      await this.inviteRepository.expireInvite(id);
      throw new Error('Invite expired');
    }
    return this.inviteRepository.declineInvite(id);
  }

  async cancelInvite(user: User, id: Invite['id']) {
    const invite = await this.inviteRepository.getInvite(id);
    if (invite.sender.id !== user.id) {
      throw new Error('User is not the sender');
    }
    return this.inviteRepository.cancelInvite(id);
  }
}
