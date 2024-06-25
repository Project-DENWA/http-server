import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import ResponseRo from 'src/common/ro/Response.ro';
import { UserModel } from 'src/models/user.model';

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

class MetaRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique meta ID.',
  })
  readonly id: string;

  @ApiProperty({
    example: 'vitalik',
    description: 'Name.',
  })
  readonly name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'A brief description.',
  })
  readonly description: string | null;
}

export class PublicUser {
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
    example: true,
    description: 'Verification of good person',
  })
  verified: boolean;

  @ApiProperty({
    example: '2023-12-11 23:08:02.949+07',
    description: 'User creation date.',
  })
  readonly createdAt?: string;

  @ApiProperty({ type: MetaRo, description: 'User meta.' })
  readonly meta: MetaRo;

  @ApiProperty({ type: AvatarRo, description: 'User avatar.' })
  readonly avatar: AvatarRo;

  constructor(user: UserModel) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.bio = user.bio;
    this.verified = user.verified;
    this.createdAt = user.created_at.getTime().toString();
    this.meta = user.meta;
    this.avatar = user.avatar;
  }
}

export class PublicUserRo extends ResponseRo {
  @ApiProperty({ nullable: false, type: () => PublicUser })
  @Type(() => PublicUser)
  readonly result: PublicUser;
}

