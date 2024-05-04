import {
  ForbiddenException,
  HttpException,
  HttpStatus,
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
import { InviteToWorkspaceDto } from './dto/invite-to-workspace.dto';
import { InvitesService } from 'src/invites/invites.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private readonly invitesService: InvitesService,
    private readonly filesService: FilesService,
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

  async getWorkspace(id: Workspace['id']) {
    const workspace = await this.workspaceRepository.findOne({ id });
    if (!workspace) {
      return new NotFoundException();
    }
    return workspace;
  }

  async createWorkspace(user: User, createWorkspaceDto: CreateWorkspaceDto) {
    const clonedPayload = {
      owner: user,
      members: [user],
      ...createWorkspaceDto,
    };

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      clonedPayload.photo = fileObject;
    }

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
    return this.usersService.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findUserThreadsWithPagination(
    workspaceId: Workspace['id'],
    user: User,
    query: IPaginationOptions,
  ): Promise<Message[]> {
    const entity = await this.usersService.findOne({ id: user.id });
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

  async inviteToWorkspace(
    workspaceId: Workspace['id'],
    sender: User,
    inviteDto: InviteToWorkspaceDto,
  ) {
    let workspace = await this.workspaceRepository.findOne({
      id: workspaceId,
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    workspace = await this.workspaceRepository.checkUserMembership(
      workspaceId,
      sender.id,
    );

    if (!workspace) {
      throw new ForbiddenException();
    }

    return this.invitesService.inviteToWorkspace(
      workspace,
      sender,
      inviteDto.emails,
    );
  }

  async checkUserMembership(
    workspaceId: Workspace['id'],
    memberId: User['id'],
  ) {
    return this.workspaceRepository.checkUserMembership(workspaceId, memberId);
  }

  async joinWorkspaceInvite(
    workspaceId: Workspace['id'],
    inviteId,
    user: User,
  ) {
    const workspace = await this.workspaceRepository.findOne({
      id: workspaceId,
    });
    if (!workspace) {
      throw new NotFoundException();
    }
    const userEntity = await this.usersService.findOne({ id: user.id });
    if (!userEntity) {
      throw new NotFoundException();
    }
    const invite = await this.invitesService.findOne({ id: inviteId });
    if (!invite) {
      throw new NotFoundException();
    }

    if (
      invite.invitee_email != userEntity.email ||
      invite.workspace.id != workspaceId
    ) {
      throw new ForbiddenException();
    }

    await this.invitesService.acceptInvite(inviteId);

    return this.workspaceRepository.addUserToWorkspace(workspaceId, user.id);
  }

  async updateWorkspace(
    id: Workspace['id'],
    user: User,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const clonedPayload = { ...updateWorkspaceDto };

    const workspace = await this.workspaceRepository.findOne({ id });

    if (workspace?.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              photo: 'imageNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      clonedPayload.photo = fileObject;
    }
    return this.workspaceRepository.update(id, clonedPayload);
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
