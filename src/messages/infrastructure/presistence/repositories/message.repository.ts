import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { MessageMapper } from '../mappers/message.mapper';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import { ICursorPaginationOptions } from 'src/utils/types/pagination-options';
import convertUTCDateToLocalDate from 'src/utils/convert-timezone';

@Injectable()
export class MessageRelationalRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const presistenceModel = MessageMapper.toPersistence(data);
    const newEntity = await this.messageRepository.save(
      this.messageRepository.create(presistenceModel),
    );
    return MessageMapper.toDomain(newEntity);
  }

  async findMessagesWithCursorPagination(
    channelId: Channel['id'],
    paginationOptions: ICursorPaginationOptions,
  ): Promise<Message[]> {
    const message = await this.messageRepository.findOne({
      where: {
        id: paginationOptions.cursor,
      },
    });

    console.log(
      'message',
      message?.createdAt.toISOString().slice(0, 19).replace('T', ' '),
    );

    console.log(
      'localDate: ',
      convertUTCDateToLocalDate(message?.createdAt as Date),
    );

    if (!message) {
      throw new Error('Message not found');
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'message.sender',
        'sender',
        'sender.id = message.senderId',
      )
      .leftJoinAndSelect(
        'message.channel',
        'channel',
        'channel.id = message.channelId',
      )
      .leftJoinAndSelect(
        'message.workspace',
        'workspace',
        'workspace.id = message.workspaceId',
      )
      .leftJoinAndSelect(
        'message.parentMessage',
        'parentMessage',
        'parentMessage.id = message.parentMessageId',
      )
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'sender.id',
        'sender.firstName',
        'sender.lastName',
        'sender.username',
        'channel.id',
        'channel.title',
        'workspace.id',
        'workspace.title',
        'parentMessage.id',
      ])
      .where('message.channelId = :channelId', { channelId })
      .andWhere(`CAST(FLOOR(message.createdAt) AS DATETIME) <= :createdAt`, {
        createdAt: convertUTCDateToLocalDate(message?.createdAt as Date)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      })
      .andWhere('message.parentMessageId IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .take(paginationOptions.limit)
      .getMany();

    return messages.map((message) => MessageMapper.toDomain(message));
  }
}
