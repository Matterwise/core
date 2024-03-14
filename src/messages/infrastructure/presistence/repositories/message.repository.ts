import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { MessageMapper } from '../mappers/message.mapper';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from 'src/utils/types/pagination-options';
import convertDateToUTC from 'src/utils/convert-timezone';
import { User } from '../../../../users/domain/user';
import { Workspace } from '../../../../workspaces/domain/workspace';

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
  ): Promise<{ messages: Message[]; nextCursor: number | null }> {
    const message = await this.messageRepository.findOne({
      where: {
        id: paginationOptions.cursor,
      },
    });

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
        createdAt: convertDateToUTC(message?.createdAt)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      })
      .andWhere('message.parentMessageId IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .take(paginationOptions.limit + 1)
      .getMany();

    let nextCursor: number | null = null;
    if (messages.length > paginationOptions.limit) {
      nextCursor = messages.pop()?.id ?? null;
    }

    return {
      messages: messages.map((message) => MessageMapper.toDomain(message)),
      nextCursor,
    };
  }

  async findUserThreadsWithPagination(
    workspaceId: Workspace['id'],
    userId: User['id'],
    paginationOptions: IPaginationOptions,
  ): Promise<Message[]> {
    const threads = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'thread_participants_user',
        'thread_participants_user',
        'message.id = thread_participants_user.parentMessageId',
      )
      .leftJoinAndSelect(
        'user',
        'user',
        'thread_participants_user.participantId = user.id',
      )
      .leftJoinAndSelect(
        'message.channel',
        'channel',
        'channel.id = message.channelId',
      )
      .leftJoinAndSelect(
        'message.sender',
        'sender',
        'sender.id = message.senderId',
      )
      .leftJoinAndSelect(
        'message.workspace',
        'workspace',
        'workspace.id = message.workspaceId',
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
      ])
      .where('user.id = :userId', { userId })
      .andWhere('message.workspaceId = :workspaceId', { workspaceId })
      .orderBy('message.createdAt', 'DESC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    if (!threads) {
      throw new Error('Threads not found');
    }

    return threads.map((thread) => MessageMapper.toDomain(thread));
  }

  async unsubscribeThread(userId: User['id'], parentMessageId: Message['id']) {
    await this.messageRepository
      .createQueryBuilder()
      .delete()
      .from('thread_participants_user')
      .where('participantId = :userId', { userId })
      .andWhere('parentMessageId = :parentMessageId', { parentMessageId })
      .execute();
  }

  async subscribeThread(userId: User['id'], parentMessageId: Message['id']) {
    await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into('thread_participants_user')
      .values({ participantId: userId, parentMessageId })
      .execute();
  }
}
