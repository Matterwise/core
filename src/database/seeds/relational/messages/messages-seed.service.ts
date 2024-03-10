import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../../../../messages/infrastructure/presistence/entities/message.entity';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { ChannelEntity } from 'src/channels/infrastructure/persistence/entities/channel.entity';

@Injectable()
export class MessagesSeedService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
  ) {}

  async run() {
    const [workspace] = await this.workspaceRepository.find({ take: 1 });
    const [user] = await this.userRepository.find({ take: 1 });
    const [channel] = await this.channelRepository.find({ take: 1 });

    const count = await this.messageRepository.count();

    if (count < 3 && user && workspace && channel) {
      await this.messageRepository.save([
        this.messageRepository.create({
          content: 'Hello World',
          sender: user,
          workspace: workspace,
          channel: channel,
        }),
      ]);

      const [message] = await this.messageRepository.find({ take: 1 });
      await this.messageRepository.save([
        this.messageRepository.create({
          content: 'In thread',
          sender: user,
          workspace: workspace,
          channel: channel,
          parentMessage: message,
        }),
      ]);
    }
  }
}
