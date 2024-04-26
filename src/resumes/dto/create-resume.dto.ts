import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class CreateResumeDto {
    @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
      })
      description: string | null;

      @ApiProperty({
        description: 'Category names of the work',
        type: [String],
        example: ['Web Development', 'Graphic Design'],
      })
      @IsArray()
      @ArrayNotEmpty()
      @IsString({ each: true })
      categoryNames: string[];
}