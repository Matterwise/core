import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadParticipantEntity } from 'src/thread-participants/infrastructure/persistence/relational/entities/thread-participant.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository } from 'typeorm';
import { MessageEntity } from 'src/messages/infrastructure/presistence/entities/message.entity';

@Injectable()
export class ThreadSeedService {
  constructor(
    @InjectRepository(ThreadParticipantEntity)
    private threadParticipantRepository: Repository<ThreadParticipantEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const [participant] = await this.userRepository.find({ take: 1 });
    const [parentMessage] = await this.messageRepository.find({ take: 1 });

    await this.threadParticipantRepository.save([
      this.threadParticipantRepository.create({
        participant,
        parentMessage,
      }),
    ]);
  }
}
