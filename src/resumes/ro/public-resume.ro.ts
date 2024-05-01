import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CategoryExpRo } from "src/categories/ro/category.ro";
import ResponseRo from "src/common/ro/Response.ro";
import { LanguageLevelRo } from "src/languages/ro/language.ro";
import { ResumeModel } from "src/models/resumes.model";
import { PublicUser } from "src/users/ro/public-user.ro";

class SocialRo {
  @ApiProperty({
    example: 'https://example.com/',
    description: 'Website link',
  })
  website: string | null;

  @ApiProperty({
    example: 'https://github.com',
    description: 'GitHub link',
  })
  github: string | null;

  @ApiProperty({
    example: 'https://t.me',
    description: 'Telegram link',
  })
  telegram: string | null;

  @ApiProperty({
    example: 'https://discord.gg',
    description: 'Discord link',
  })
  discord: string | null;
}

export class PublicResumeRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique resume ID',
  })
  readonly id: string;

  @ApiProperty({
      example: 'A brief description of the object.',
      description: 'Description',
  })
  public description: string | null;

  @ApiProperty({
    example: true,
    description: 'Verification of resume',
  })
  verified: boolean;

  @ApiProperty({
    example: '4.34',
    description: 'Rating of resume',
  })
  rating: number;

  @ApiProperty({
      example: '2023-12-11 23:08:02.949+07',
      description: 'Resume creation date',
  })
  readonly createdAt: string;

  @ApiProperty({ type: SocialRo, description: 'Resume social' })
  readonly social: SocialRo;

  @ApiProperty({ description: 'Resume user' })
  readonly user: PublicUser;

  @ApiProperty({
    type: [CategoryExpRo],
    description: 'List of resume categories',
  })
  readonly categories: CategoryExpRo[];

  @ApiProperty({
    type: [LanguageLevelRo],
    description: 'List of resume languages',
  })
  readonly languages: LanguageLevelRo[];

  constructor(resume: ResumeModel) {
    this.id = resume.id;
    this.description = resume.description;
    this.verified = resume.verified;
    this.rating = resume.rating;
    this.createdAt = resume.created_at.getTime().toString();
    this.social = resume.social;
    this.user = {
      id: resume.user.id,
      fullname: resume.user.fullname,
      bio: resume.user.bio,
      email: resume.user.email,
      meta: resume.user.meta,
      avatar: resume.user.avatar,
    };
    this.categories = resume.resumeCategories?.map(category => {
       return new CategoryExpRo(category.category, category.exp); 
      }) || [];
    this.languages = resume.resumeLanguages?.map(language => {
      return new LanguageLevelRo(language.language, language.level); 
    }) || [];
  }
}


export class ResumeRo extends ResponseRo {
    @ApiProperty({ nullable: false, type: () => PublicResumeRo })
    @Type(() => PublicResumeRo)
    readonly result: PublicResumeRo;
  }
  