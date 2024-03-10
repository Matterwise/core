import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Message } from '../../messages/domain/message';

export class ThreadParticipant {
  @ApiProperty({
    example: 1,
  })
  participantId: number;

  @ApiProperty({
    example: 1,
  })
  parentMessageId: number;

  participant: User;

  parentMessage: Message;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
