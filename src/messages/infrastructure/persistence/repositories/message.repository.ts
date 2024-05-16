import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MessageMapper } from '../mappers/message.mapper';
import { Message } from 'src/messages/domain/message';
import { Channel } from 'src/channels/domain/channel';
import {
  ICursorPaginationOptions,
  IPaginationOptions,
} from 'src/utils/types/pagination-options';
import convertDateToUTC from 'src/utils/convert-timezone';
import { User } from '../../../../users/domain/user';
import {
  FilterMessageDto,
  SortMessageDto,
} from 'src/messages/dto/query-message.dto';
import { Workspace } from 'src/workspaces/domain/workspace';
import { MessageRepository } from '../message.repository';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { loadRelationships } from 'src/utils/load-relationships';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const presistenceModel = MessageMapper.toPersistence(data);
    const newEntity = await this.messageRepository.save(
      this.messageRepository.create(presistenceModel),
    );
    await loadRelationships(
      this.messageRepository,
      ['sender', 'parentMessage'],
      [newEntity],
    );
    return MessageMapper.toDomain(newEntity);
  }

  async findOne(
    fields: EntityCondition<Message>,
  ): Promise<NullableType<Message>> {
    const entity = await this.messageRepository.findOne({
      where: fields as FindOptionsWhere<MessageEntity>,
    });

    await loadRelationships(
      this.messageRepository,
      ['channel', 'sender', 'workspace', 'files', 'parentMessage'],
      [entity],
    );

    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async softDelete(id: Message['id']): Promise<void> {
    await this.messageRepository.softDelete(id);
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messageRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Message not found');
    }

    await loadRelationships(
      this.messageRepository,
      ['channel', 'sender', 'workspace'],
      [entity],
    );

    const updatedMessage = await this.messageRepository.save(
      this.messageRepository.create(
        MessageMapper.toPersistence({
          ...MessageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );
    return MessageMapper.toDomain(updatedMessage);
  }

  async findMessagesWithCursorPagination({
    channelId,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    channelId: Channel['id'];
    filterOptions?: FilterMessageDto | null;
    sortOptions?: SortMessageDto[] | null;
    paginationOptions: ICursorPaginationOptions;
  }): Promise<{ messages: Message[]; nextCursor: number | null }> {
    let message: MessageEntity | null;

    if (paginationOptions.cursor) {
      message = await this.messageRepository.findOne({
        where: {
          id: paginationOptions.cursor,
        },
      });
    } else {
      message = await this.messageRepository.findOne({
        where: {
          channel: {
            id: channelId as number,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }

    if (!message) {
      throw new Error('Message not found');
    }

    let query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'message.sender',
        'sender',
        'sender.id = message.senderId',
      )
      .leftJoinAndSelect('sender.photo', 'photo', 'photo.id = sender.photoId')
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
        'message.childsCount',
        'sender.id',
        'sender.firstName',
        'sender.lastName',
        'sender.username',
        'sender.photo',
        'photo.id',
        'photo.path',
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
      });

    if (filterOptions?.draft !== undefined) {
      query = query.andWhere('message.draft = :draft', {
        draft: filterOptions.draft,
      });
    } else {
      query = query.andWhere('message.draft = false');
    }

    if (filterOptions?.parentMessageId) {
      query = query.andWhere('message.parentMessageId = :parentMessageId', {
        parentMessageId: filterOptions.parentMessageId,
      });
    } else {
      query = query.andWhere('message.parentMessageId IS NULL');
    }

    if (sortOptions) {
      sortOptions.forEach((sortOption) => {
        query = query.addOrderBy(
          `message.${sortOption.orderBy}`,
          sortOption.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      query = query.orderBy('message.createdAt', 'DESC');
    }

    const messages = await query.take(paginationOptions.limit + 1).getMany();

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
        'message.childsCount',
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
