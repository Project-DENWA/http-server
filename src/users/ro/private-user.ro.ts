import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/models/user.model';
import ResponseRo from 'src/common/ro/Response.ro';
import { Type } from 'class-transformer';
import { ResumeModel } from 'src/models/resumes.model';

class EmailRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique email ID',
  })
  readonly id: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'Account email address',
  })
  readonly email: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  readonly verified: boolean;
}

class AvatarRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique avatar ID.',
  })
  readonly id: string;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Icon URL.',
  })
  readonly icon: string | null;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Cover image URL.',
  })
  readonly cover: string | null;
}

class NotificationRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique notification ID.',
  })
  readonly id: string;

  @ApiProperty({
    example: true,
    description: 'Receive notifications about news.',
    default: true,
  })
  readonly news: boolean;
}

class MetaRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique meta ID.',
  })
  readonly id: string;

  @ApiProperty({
    example: 'vitalik',
    description: 'Name',
  })
  readonly name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'A brief description.',
  })
  readonly description: string | null;
}

class ResumeRo {
  id: string;
  description: string | null;
  verified: boolean;
  rating: number;
  status: string;
  created_at: Date;

  constructor(resume: ResumeModel) {
    this.id = resume.id;
    this.description = resume.description;
    this.verified = resume.verified;
    this.rating = resume.rating;
    this.status = resume.status;
}
}

export class PrivateUser {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique user ID.',
  })
  readonly id: string;

  @ApiProperty({ example: 'John Smith', description: 'User full name.' })
  readonly fullname: string;

  @ApiProperty({ example: 'Bio of a user', description: 'Bio description' })
  public bio: string;

  @ApiProperty({
    description: 'Is two-factor authentication connected to the account.',
  })
  readonly tfa: boolean;

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

  @ApiProperty({ type: ResumeRo, description: 'User resume' })
  public resume: ResumeRo;

  @ApiProperty({
    type: NotificationRo,
    description: 'User notification preferences',
  })
  readonly notification: NotificationRo;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.fullname = userModel.fullname;
    this.bio = userModel.bio;
    this.createdAt = userModel.created_at.getTime().toString();
    this.meta = userModel.meta;
    this.email = userModel.email;
    this.avatar = userModel.avatar;
    this.tfa = !!userModel.tfaSecret;
    this.notification = userModel.notification;
    if (userModel.resume)
      this.resume = new ResumeRo(userModel.resume);
  }
}

export class PrivateUserRo extends ResponseRo {
  @ApiProperty({ nullable: false, type: () => PrivateUser })
  @Type(() => PrivateUser)
  readonly result: PrivateUser;
}
