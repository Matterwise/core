import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChannelsService } from 'src/channels/channels.service';
import { Channel } from 'src/channels/domain/channel';
import { AddUsersToChannelDto } from 'src/channels/dto/add-users-to-channel.dto';
import {
  FilterChannelDto,
  SortChannelDto,
} from 'src/channels/dto/query-channel.dto';
import { User } from 'src/users/domain/user';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Workspace } from 'src/workspaces/domain/workspace';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Injectable()
export class WorkspaceChannelService {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly channelsService: ChannelsService,
  ) {}

  async addUsersToChannel(
    user: User,
    workspaceId: Workspace['id'],
    channelId: Channel['id'],
    data: AddUsersToChannelDto,
  ) {
    const channel = await this.channelsService.getChannelById(user, channelId);
    if (!channel) {
      throw new NotFoundException();
    }
    if (channel.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    const usersToAdd = await this.getWorkspaceMembers(data.users, workspaceId);

    return await this.channelsService.addUsersToChannel(channelId, usersToAdd);
  }

  private async getWorkspaceMembers(
    users: User[],
    workspaceId: Workspace['id'],
  ): Promise<User[]> {
    const checkMembershipPromises = users.map((user) =>
      this.workspacesService
        .checkUserMembership(workspaceId, user.id)
        .then((isMember) => (isMember ? user : null)),
    );

    const workspaceMembers = (
      await Promise.all(checkMembershipPromises)
    ).filter((user): user is User => user !== null);

    return [...new Set(workspaceMembers)];
  }

  async getWorkspaceChannels({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterChannelDto | null;
    sortOptions?: SortChannelDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Channel[]> {
    return this.channelsService.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
