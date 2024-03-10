import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { ThreadParticipantEntity } from 'src/thread-participants/infrastructure/persistence/relational/entities/thread-participant.entity';

@EventSubscriber()
export class MessageSubscriber
  implements EntitySubscriberInterface<MessageEntity>
{
  listenTo() {
    return MessageEntity;
  }

  async afterInsert(event: InsertEvent<MessageEntity>) {
    if (event.entity.parentMessage && event.entity.sender) {
      const threadParticipant = new ThreadParticipantEntity();
      threadParticipant.participant = event.entity.sender;
      threadParticipant.parentMessage = event.entity.parentMessage;
      await event.manager
        .getRepository(ThreadParticipantEntity)
        .save(threadParticipant);
    }
  }
}
