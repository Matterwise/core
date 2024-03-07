import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitePersistenceModule } from './infrastructure/presistence/persistence.module';
import { InvitesService } from './invites.service';

@Module({
  imports: [InvitePersistenceModule],
  providers: [InvitesService],
  controllers: [InvitesController],
  exports: [InvitesService, InvitePersistenceModule],
})
export class InvitesModule {}
