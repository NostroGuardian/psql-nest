import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly alias: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
