import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { FileDto } from 'src/files/dto/file.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthUpdateDto {
  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiProperty({ example: 'test1@example.com' })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword?: string;
}
