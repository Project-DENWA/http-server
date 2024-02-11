import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/models/user.model';

export class PublicUserDto {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique user ID',
  })
  readonly id: string;

  @ApiProperty({ example: 'Ivanov Ivan Ivanovich', description: 'Full name' })
  readonly fullname: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
  readonly email: string;

  @ApiProperty({ example: 'ExampleName', description: 'Username' })
  readonly username: string;

  @ApiProperty({ example: true, description: 'Person verification status' })
  readonly verified: boolean;

  @ApiProperty({ example: true, description: 'Email verification status' })
  readonly verifiedEmail: boolean;

  @ApiProperty({ example: 'User bio here', description: 'User biography' })
  readonly bio: string | null;

  @ApiProperty({
    example: '/uploads/avatars/default.jpg',
    description: 'URL of the user avatar',
  })
  readonly avatarUrl: string | null;

  @ApiProperty({
    example: '/uploads/covers/default-cover.jpg',
    description: 'URL of the user cover image',
  })
  readonly coverImageUrl: string | null;

  @ApiProperty({ example: true, description: 'Notification settings for news' })
  readonly news: boolean;

  @ApiProperty({ example: true, description: 'Notification settings for messages' })
  readonly messages: boolean;

  @ApiProperty({
    example: '2023-12-11 23:08:02.949+07',
    description: 'User creation date',
  })
  readonly createdAt: string;

  constructor(user: UserModel) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.username = user.meta.name;
    this.email = user.email.email;
    this.verified = user.verified;
    this.verifiedEmail = user.email.verified;
    this.bio = user.meta.description;
    this.avatarUrl = user.avatar.icon;
    this.coverImageUrl = user.avatar.cover;
    this.news = user.notification.news;
    this.messages = user.notification.messages;
    this.createdAt = user.created_at.getTime().toString();
  }
}
