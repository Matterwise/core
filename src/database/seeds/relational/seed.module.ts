import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/database/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { WorkspaceSeedModule } from './workspace/workspace-seed.module';
import { MessagesSeedModule } from './messages/messages-seed.module';
import { ChannelSeedModule } from './channel/channel-seed.module';
import { ChannelTypeSeedModule } from './channel-type/channel-type-seed.module';
import { InviteStatusSeedModule } from './invite-status/invite-status-seed.module';

@Module({
  imports: [
    MessagesSeedModule,
    ChannelTypeSeedModule,
    ChannelSeedModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    WorkspaceSeedModule,
    InviteStatusSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
