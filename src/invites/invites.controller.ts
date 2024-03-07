import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Invite } from './domain/invite';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly service: InvitesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createInvite(@Request() request, @Body() data: CreateInviteDto) {
    return this.service.createInvite(request.user, data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  getInvite(@Request() request, @Param('id') inviteId: Invite['id']) {
    return this.service.getInvite(request.user, inviteId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
  })
  @Post(':id/accept')
  acceptInvite(@Request() request, @Body('inviteId') inviteId: Invite['id']) {
    return this.service.acceptInvite(request.user, inviteId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
  })
  @Post(':id/decline')
  declineInvite(@Request() request, @Body('inviteId') inviteId: Invite['id']) {
    return this.service.declineInvite(request.user, inviteId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
  })
  @Post(':id/cancel')
  cancelInvite(@Request() request, @Body('inviteId') inviteId: Invite['id']) {
    return this.service.cancelInvite(request.user, inviteId);
  }
}
