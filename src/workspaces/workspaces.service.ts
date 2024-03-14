import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRepository } from './infrastructure/persistence/workspace.repository';
import { User } from 'src/users/domain/user';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './domain/workspace';
import { FilterUserDto, SortUserDto } from '../users/dto/query-user.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UsersService } from '../users/users.service';
import { Message } from '../messages/domain/message';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  async getWorkspaces(
    user: User,
    paginationOptions: { page: number; limit: number },
  ) {
    return this.workspaceRepository.findManyWithPagination(
      user.id as number,
      paginationOptions,
    );
  }

  async createWorkspace(user: User, createWorkspaceDto: CreateWorkspaceDto) {
    const clonedPayload = {
      owner: user,
      members: [user],
      ...createWorkspaceDto,
    };

    return this.workspaceRepository.create(clonedPayload);
  }

  async getWorkspaceUsers({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.userService.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async getWorkspaceChannels(
    workspaceId: Workspace['id'],
    paginationOptions: { page: number; limit: number },
  ) {
    return this.workspaceRepository.findChannelsWithPagination(
      workspaceId,
      paginationOptions,
    );
  }

  async findUserThreadsWithPagination(
    workspaceId: Workspace['id'],
    user: User,
    query: IPaginationOptions,
  ): Promise<Message[]> {
    const entity = await this.userService.findOne({ id: user.id });
    if (!entity) {
      throw new NotFoundException();
    }

    const workspace = await this.workspaceRepository.findOne({
      id: workspaceId,
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    return this.messagesService.findUserThreadsWithPagination(
      workspaceId,
      user.id,
      query,
    );
  }

  async updateWorkspace(
    id: Workspace['id'],
    user: User,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const workspace = await this.workspaceRepository.findOne({ id });
    if (!workspace) {
      throw new NotFoundException();
    }

    if (workspace?.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.workspaceRepository.update(id, updateWorkspaceDto);
  }

  async remove(id: Workspace['id'], user: User) {
    const workspace = await this.workspaceRepository.findOne({ id });

    if (!workspace) {
      throw new NotFoundException();
    }

    if (workspace?.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.workspaceRepository.softDelete(id);
  }
}
