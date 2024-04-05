import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/models/user.model';

class EmailRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique email ID',
  })
  readonly id: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
  readonly email: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  readonly verified: boolean;
}

class AvatarRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique avatar ID',
  })
  readonly id: string;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Icon URL',
  })
  readonly icon: string | null;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Cover image URL',
  })
  readonly cover: string | null;
}

class NotificationRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique notification ID',
  })
  readonly id: string;

  @ApiProperty({
    example: true,
    description: 'Receive notifications about news',
    default: true,
  })
  news: boolean;

  @ApiProperty({
    example: true,
    description: 'Receive notifications about messages',
    default: true,
  })
  messages: boolean;
}

class MetaRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique meta ID',
  })
  readonly id: string;

  @ApiProperty({
    example: 'vitalik',
    description: 'Name',
  })
  readonly name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'Description',
  })
  readonly description: string | null;
}

export class PublicUserRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique user ID',
  })
  readonly id: string;

  @ApiProperty({ example: 'Ivanov Ivan Ivanovich', description: 'Full name' })
  readonly fullname: string;

  @ApiProperty({
    example: '2023-12-11 23:08:02.949+07',
    description: 'User creation date',
  })
  readonly createdAt: string;

  @ApiProperty({ type: MetaRo, description: 'User meta' })
  readonly meta: MetaRo;

  @ApiProperty({ type: EmailRo, description: 'Email information' })
  readonly email: EmailRo;

  @ApiProperty({ type: AvatarRo, description: 'User avatar' })
  readonly avatar: AvatarRo;

  @ApiProperty({
    type: NotificationRo,
    description: 'User notification preferences',
  })
  readonly notification: NotificationRo;

  constructor(user: UserModel) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.meta = user.meta;
    this.email = user.email;
    this.avatar = user.avatar;
    this.notification = user.notification;
    this.createdAt = user.created_at.getTime().toString();
  }
}
