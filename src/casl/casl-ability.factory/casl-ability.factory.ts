import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { Channel } from 'src/channels/domain/channel';
import { Message } from 'src/messages/domain/message';
import { Workspace } from 'src/workspaces/domain/workspace';
import { Action } from '../action.enum';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { RoleEnum } from 'src/roles/roles.enum';

type Subjects =
  | InferSubjects<typeof Workspace | typeof Channel | typeof Message>
  | 'all';

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;
type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    if (user.role?.id === RoleEnum.admin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, Channel);
      can(Action.Create, Channel);
      can(Action.Update, Channel, { owner: user });
      can(Action.Delete, Channel, { owner: user });
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
