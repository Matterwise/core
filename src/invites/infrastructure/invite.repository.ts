import { Invite } from '../domain/invite';

export abstract class InviteRepository {
  abstract create(data: Invite): Promise<Invite>;
  abstract getInvite(id: Invite['id']): Promise<Invite>;
  abstract acceptInvite(data: Invite['id']): Promise<Invite>;
  abstract declineInvite(data: Invite['id']): Promise<Invite>;
  abstract calnsleInvite(data: Invite['id']): Promise<Invite>;
}
