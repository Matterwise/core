import { Invite } from '../domain/invite';

export abstract class InviteRepository {
  abstract create(
    data: Omit<Invite, 'id' | 'createdAt' | 'status' | 'expiresAt'>,
  ): Promise<Invite>;
  abstract getInvite(id: Invite['id']): Promise<Invite>;
  abstract acceptInvite(data: Invite['id']): Promise<Invite>;
  abstract declineInvite(data: Invite['id']): Promise<Invite>;
  abstract expireInvite(data: Invite['id']): Promise<Invite>;
  abstract cancelInvite(data: Invite['id']): Promise<Invite>;
}
