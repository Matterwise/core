import { MessageEntity } from '../../../../../messages/infrastructure/presistence/entities/message.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ThreadParticipant } from '../../../../domain/thread-participant';
import { ThreadParticipantEntity } from '../entities/thread-participant.entity';

export class ThreadMapper {
  static toDomain(raw: ThreadParticipantEntity): ThreadParticipant {
    const thread = new ThreadParticipant();

    thread.participant = raw.participant;
    thread.parentMessage = raw.parentMessage;

    return thread;
  }

  static toPersistence(thread: ThreadParticipant): ThreadParticipantEntity {
    const participant = new UserEntity();
    participant.id = thread.participant.id as number;

    const parentMessage = new MessageEntity();
    parentMessage.id = Number(thread.parentMessage.id);

    const threadParticipantEntity = new ThreadParticipantEntity();
    threadParticipantEntity.participant = participant;
    threadParticipantEntity.parentMessage = parentMessage;

    return threadParticipantEntity;
  }
}
