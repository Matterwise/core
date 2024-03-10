import { Module } from '@nestjs/common';
import { RelationalThreadPersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [RelationalThreadPersistenceModule],
})
export class ThreadsModule {}
