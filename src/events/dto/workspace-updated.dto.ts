import { IsNotEmpty, ValidateNested } from 'class-validator';
import { EventDto } from './event.dto';
import { Workspace } from 'src/workspaces/domain/workspace';
import { UpdateWorkspaceDto } from 'src/workspaces/dto/update-workspace.dto';

export class WorkspaceUpdatedDto extends EventDto {
  @IsNotEmpty()
  id: Workspace['id'];

  @IsNotEmpty()
  @ValidateNested()
  data: UpdateWorkspaceDto;
}
