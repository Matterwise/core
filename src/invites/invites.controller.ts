import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('invites')
export class InvitesController {
  constructor(private readonly service: InvitesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createInvite() {
    return this.service.createInvite();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getInvite() {
    return this.service.getInvite();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('accept')
  acceptInvite() {
    return this.service.acceptInvite();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('decline')
  declineInvite() {
    return this.service.declineInvite();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('cancel')
  cancelInvite() {
    return this.service.cancelInvite();
  }
}
