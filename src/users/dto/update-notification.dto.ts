import { ApiProperty } from '@nestjs/swagger';

export class NotificationSettingsDto {
  @ApiProperty({
    required: false,
    description: 'Whether the user wants to receive news and updates',
  })
  readonly news?: boolean;
}
