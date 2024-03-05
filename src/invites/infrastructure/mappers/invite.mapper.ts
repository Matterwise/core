import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { InviteEntity } from '../entities/invite.entity';
import { Invite } from 'src/invites/domain/invite';

export class InviteMapper {
  static toDomain(raw) {
    const invite = new Invite();
    invite.id = raw.id;
    invite.workspace = raw.workspace;
    invite.invitee = raw.invitee;
    invite.sender = raw.sender;
    invite.createdAt = raw.createdAt;
    invite.expiresAt = raw.expiresAt;
    invite.status = raw.status;
    return invite;
  }

  static toPersistence(invite) {
    const workspace = new WorkspaceEntity();
    workspace.id = Number(invite.workspace.id);
    const invitee = new UserEntity();
    invitee.id = Number(invite.invitee.id);
    const sender = new UserEntity();
    sender.id = Number(invite.sender.id);
    const inviteEntity = new InviteEntity();
    if (invite.id && typeof invite.id === 'number') {
      inviteEntity.id = invite.id;
    }
    inviteEntity.workspace = workspace;
    inviteEntity.invitee = invitee;
    inviteEntity.sender = sender;
    inviteEntity.createdAt = invite.createdAt;
    inviteEntity.expiresAt = invite.expiresAt;
    inviteEntity.status = invite.status;
    return inviteEntity;
  }
}
