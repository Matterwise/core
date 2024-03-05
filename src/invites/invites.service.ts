import { Injectable } from '@nestjs/common';

/*
    - get invites for workspace
    - get invites for users  

*/
@Injectable()
export class InvitesService {
  constructor() {}

  createInvite() {
    return 'This action adds a new invite';
  }

  getInvite() {
    return 'This action returns a invite';
  }

  acceptInvite() {
    return 'This action accepts a invite';
  }

  declineInvite() {
    return 'This action declines a invite';
  }

  cancelInvite() {
    return 'This action cancels a invite';
  }
}
