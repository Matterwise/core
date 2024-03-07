import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './entities/invite.entity';
import { InviteRepository } from './invite.repository';
import { InviteRelationalRepository } from './repositories/invite.repository';
@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity])],
  providers: [
    {
      provide: InviteRepository,
      useClass: InviteRelationalRepository,
    },
  ],
  exports: [InviteRepository],
})
export class InvitePersistenceModule {}
