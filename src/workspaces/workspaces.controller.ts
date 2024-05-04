import {
  Controller,
  Get,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './domain/workspace';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Message } from '../messages/domain/message';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { InviteToWorkspaceDto } from './dto/invite-to-workspace.dto';
import { Invite } from 'src/invites/domain/invite';

@ApiTags('Workspaces')
@Controller({
  path: 'workspaces',
  version: '1',
})
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(@Request() request, @Query() query: IPaginationOptions) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.service.getWorkspaces(request.user, { page, limit }),
      { page: Number(page), limit: Number(limit) },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createWorkspace(
    @Request() request,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.service.createWorkspace(request.user, createWorkspaceDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  getWorkspace(@Param('id') id: Workspace['id']) {
    return this.service.getWorkspace(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/users')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  async getWorkspaceUsers(
    @Param('id') workspaceId: Workspace['id'],
    @Query() query: QueryUserDto,
  ) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.service.getWorkspaceUsers({
        filterOptions: {
          workspaceId,
          ...query?.filters,
        },
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/threads')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async findThreads(
    @Param('id') id: Workspace['id'],
    @Request() request,
    @Query() query: IPaginationOptions,
  ): Promise<InfinityPaginationResultType<Message>> {
    query.page = query.page ?? 1;
    query.limit = query.limit ?? 20;
    if (query.limit > 50) {
      query.limit = 50;
    }
    return infinityPagination(
      await this.service.findUserThreadsWithPagination(id, request.user, query),
      { page: query.page, limit: query.limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/invite')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  inviteToWorkspace(
    @Param('id') id: Workspace['id'],
    @Request() request,
    @Body() emails: InviteToWorkspaceDto,
  ) {
    return this.service.inviteToWorkspace(id, request.user, emails);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/invite/:inviteId')
  @ApiParam({
    name: 'id',
  })
  @ApiParam({
    name: 'inviteId',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  joinWorkspaceInvite(
    @Param('id') id: Workspace['id'],
    @Param('inviteId') inviteId: Invite['id'],
    @Request() request,
  ) {
    return this.service.joinWorkspaceInvite(id, inviteId, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @SerializeOptions({
    groups: ['me'],
  })
  @ApiParam({
    name: 'id',
  })
  updateWorkspace(
    @Param('id') id: Workspace['id'],
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Request() request,
  ) {
    return this.service.updateWorkspace(id, request.user, updateWorkspaceDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeWorkspace(@Param('id') id: Workspace['id'], @Request() request) {
    return this.service.remove(id, request.user);
  }
}
