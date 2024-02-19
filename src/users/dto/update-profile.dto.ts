import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Fedya', description: 'new username', required: false, })
  readonly newFullname?: string;

  @ApiProperty({ example: 'Nazi', description: 'Bio description', required: false, })
  readonly newBio?: string;
}
