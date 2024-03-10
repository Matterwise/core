import { ThreadParticipant } from '../../../domain/thread-participant';

export abstract class ThreadParticipantRepository {
  abstract create(data: ThreadParticipant): Promise<ThreadParticipant>;
}
