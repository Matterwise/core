import { Invite } from 'src/invites/domain/invite';
import { InviteEntity } from '../entities/invite.entity';
import { UserMapper } from 'src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { InviteStatusEntity } from 'src/inviteStatuses/infrastructure/persistence/relational/entities/invite-status.entity';

export class InviteMapper {
  static toDomain(raw: InviteEntity): Invite {
    const invite = new Invite();
    invite.id = raw.id;
    if (raw.sender) {
      invite.sender = UserMapper.toDomain(raw.sender);
    }
    invite.invitee_email = raw.invitee_email;
    if (raw.workspace) {
      invite.workspace = {
        id: raw.workspace.id,
        title: raw.workspace.title,
        photo: raw.workspace.photo
          ? {
              id: raw.workspace.photo.id,
              path: raw.workspace.photo.path,
            }
          : undefined,
      };
    }
    invite.status = raw.status;
    invite.createdAt = raw.createdAt;
    invite.updatedAt = raw.updatedAt;
    return invite;
  }

  static toPersistence(invite: Invite): InviteEntity {
    const sender = new UserEntity();
    sender.id = Number(invite.sender.id);

    const workspace = new WorkspaceEntity();
    workspace.id = Number(invite.workspace.id);

    const status = new InviteStatusEntity();
    status.id = invite.status.id;

    const inviteEntity = new InviteEntity();
    if (invite.id && typeof invite.id === 'number') {
      inviteEntity.id = invite.id;
    }

    inviteEntity.sender = sender;
    inviteEntity.invitee_email = invite.invitee_email;
    inviteEntity.workspace = workspace;
    inviteEntity.status = status;
    inviteEntity.createdAt = invite.createdAt;
    inviteEntity.updatedAt = invite.updatedAt;

    return inviteEntity;
  }
}
