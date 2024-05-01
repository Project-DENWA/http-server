import { ApiProperty } from '@nestjs/swagger';

export class UpdateSocialDto {
  @ApiProperty({
    example: 'https://',
    description: 'Website link',
    required: false,
  })
  readonly websiteURL?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Github link',
    required: false,
  })
  readonly github?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Telegram link',
    required: false,
  })
  readonly telegram?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Discord link',
    required: false,
  })
  readonly discord?: string;
}
