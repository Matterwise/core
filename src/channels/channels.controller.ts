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
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Channel } from './domain/channel';

@ApiTags('Channels')
@Controller({
  path: 'channels',
  version: '1',
})
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createChannel(
    @Request() request,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelsService.createChannel(request.user, createChannelDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(HttpStatus.OK)
  getChannelById(@Request() request, @Param('id') id: Channel['id']) {
    return this.channelsService.getChannelById(request.user, id);
  }
}
