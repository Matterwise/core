import { Channel } from 'src/channels/domain/channel';

export type FlatChannel = Channel & {
  'owner.id': Channel['owner']['id'];
};
