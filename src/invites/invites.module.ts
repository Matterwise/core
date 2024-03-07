import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitePersistenceModule } from './infrastructure/persistence.module';

@Module({
  providers: [InvitePersistenceModule],
  controllers: [InvitesController],
})
export class InvitesModule {}
