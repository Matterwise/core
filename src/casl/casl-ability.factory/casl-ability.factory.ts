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

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;
export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    if (user.role?.id === RoleEnum.admin) {
      can(Action.MANAGE, 'all');
    } else {
      can(Action.READ, Channel);
      can(Action.CREATE, Channel);
      can(Action.UPDATE, Channel);
      can(Action.DELETE, Channel);
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
