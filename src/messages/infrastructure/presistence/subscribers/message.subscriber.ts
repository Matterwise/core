import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { MessageEntity } from '../entities/message.entity';

@EventSubscriber()
export class MessageSubscriber
  implements EntitySubscriberInterface<MessageEntity>
{
  listenTo() {
    return MessageEntity;
  }

  async afterInsert(event: InsertEvent<MessageEntity>) {
    if (event.entity.parentMessage) {
      await event.manager
        .createQueryBuilder()
        .insert()
        .into('thread_participants_user')
        .values([
          {
            participantId: event.entity.sender.id,
            parentMessageId: event.entity.parentMessage.id,
          },
        ])
        .orIgnore()
        .execute();
    }
  }
}
