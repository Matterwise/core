import { Workspace } from 'src/workspaces/domain/workspace';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from 'src/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateWorkspaceDto } from '../../dto/update-workspace.dto';
import { Channel } from '../../../channels/domain/channel';

export abstract class WorkspaceRepository {
  abstract create(
    data: Omit<
      Workspace,
      'id' | 'members' | 'channels' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<Workspace>;

  abstract findManyWithPagination(
    userId: User['id'],
    paginationOptions: IPaginationOptions,
  ): Promise<Workspace[]>;

  abstract findChannelsWithPagination(
    workspaceId: Workspace['id'],
    paginationOptions: IPaginationOptions,
  ): Promise<Channel[]>;

  abstract findOne(
    fields: EntityCondition<Workspace>,
  ): Promise<NullableType<Workspace>>;

  abstract update(
    workspaceId: Workspace['id'],
    updateWorkspace: UpdateWorkspaceDto,
  ): Promise<Workspace>;

  abstract softDelete(id: Workspace['id']): Promise<void>;
}
