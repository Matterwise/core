import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MessagesModule } from '../messages/messages.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule, MessagesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
