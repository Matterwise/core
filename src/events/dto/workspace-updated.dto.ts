import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BroadcastDto, EventDto } from './event.dto';
import { Workspace } from 'src/workspaces/domain/workspace';
import { UpdateWorkspaceDto } from 'src/workspaces/dto/update-workspace.dto';
import { Type } from 'class-transformer';

class BroadcastWorkspaceUpdatedDto extends BroadcastDto {
  @IsNotEmpty()
  workspace_id: Workspace['id'];
}

export class WorkspaceUpdatedDto extends EventDto {
  @IsNotEmpty()
  @ValidateNested()
  data: UpdateWorkspaceDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BroadcastWorkspaceUpdatedDto)
  broadcast: BroadcastWorkspaceUpdatedDto;
}
