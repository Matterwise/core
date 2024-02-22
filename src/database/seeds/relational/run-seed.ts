import { NestFactory } from '@nestjs/core';
import { MessagesSeedService } from './messages/messages-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { WorkspaceSeedService } from './workspace/workspace-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(WorkspaceSeedService).run();
  await app.get(MessagesSeedService).run();

  await app.close();
};

void runSeed();
