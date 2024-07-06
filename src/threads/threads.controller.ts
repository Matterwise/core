import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Query,
  Post,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from 'src/users/dto/query-user.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { ThreadsService } from './threads.service';
import { AiService } from 'src/ai/ai.service';

@ApiTags('Threads')
@Controller({
  path: 'threads',
  version: '1',
})
export class ThreadsController {
  constructor(
    private readonly service: ThreadsService,
    private readonly aiService: AiService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/users')
  @ApiParam({
    name: 'id',
    description: 'Parent message Id',
  })
  @HttpCode(HttpStatus.OK)
  async getThreadUsers(@Param('id') id: string, @Query() query: QueryUserDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.service.getThreadUsers({
        filterOptions: {
          parentMessageId: id,
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
  @Post(':id/subscribe')
  @ApiParam({
    name: 'id',
    description: 'Parent message Id',
  })
  async subscribeThread(@Param('id') id: string, @Request() request) {
    return this.service.subscribeThread(request.user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/unsubscribe')
  @ApiParam({
    name: 'id',
    description: 'Parent message Id',
  })
  async unsubscribeThread(@Param('id') id: string, @Request() request) {
    return this.service.unsubscribeThread(request.user.id, id);
  }

  @Post('summarize/:parentMessageId')
  @ApiParam({
    name: 'parentMessageId',
    description: 'Parent message Id',
  })
  @ApiQuery({
    name: 'channelId',
    description: 'Channel Id',
  })
  async summarizeThread(
    @Param('parentMessageId') parentMessageId: string,
    @Query()
    query: {
      channelId: string;
    },
  ): Promise<any> {
    console.log('parentMessageId', parentMessageId);
    console.log('channelId', query.channelId);
    const summary = await this.aiService.summarizeThread(
      parentMessageId,
      query.channelId,
    );
    return { summary };
  }
}
