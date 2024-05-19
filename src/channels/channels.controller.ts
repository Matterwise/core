import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Channel } from './domain/channel';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryMessageDto } from 'src/messages/dto/query-message.dto';
import { CheckPolicies } from 'src/authz/check-policies/check-policies.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/casl/action.enum';
import { PoliciesGuard } from 'src/authz/policies.guard/policies.guard';

@ApiTags('Channels')
@Controller({
  path: 'channels',
  version: '1',
})
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.CREATE, Channel))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createChannel(
    @Request() request,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelsService.createChannel(request.user, createChannelDto);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  getChannelById(@Request() request, @Param('id') id: Channel['id']) {
    return this.channelsService.getChannelById(request.user, id);
  }

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.UPDATE, Channel))
  @Patch(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: Channel['id'],
    @Body() updateChannelDto: UpdateChannelDto,
    @Request() request,
  ): Promise<Channel | null> {
    return this.channelsService.update(request.user, id, updateChannelDto);
  }

  @ApiBearerAuth()
  @Get(':id/messages')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  getChannelMessages(
    @Param('id') id: Channel['id'],
    @Query() query: QueryMessageDto,
  ) {
    query.limit = query.limit ?? 20;
    if (query.limit > 100) {
      query.limit = 100;
    }
    return this.channelsService.getMessagesWithCursorPagination({
      channelId: id,
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        cursor: query.cursor,
        limit: query.limit,
      },
    });
  }

  @ApiBearerAuth()
  @Get(':id/users')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  async getChannelUsers(
    @Param('id') channelId: Channel['id'],
    @Query() query: QueryUserDto,
  ) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.channelsService.getChannelUsers({
        filterOptions: {
          channelId,
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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.DELETE, Channel))
  @Delete(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Channel['id'], @Request() request): Promise<void> {
    return this.channelsService.softDelete(request, id);
  }
}
