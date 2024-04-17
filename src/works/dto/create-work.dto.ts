import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";


export class CreateWorkDto {
  @ApiProperty({ example: 'ExampleName', description: 'Username' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'ExampleName', description: 'Username', nullable: true })
  @IsString()
  readonly description?: string | null;

  @ApiProperty({
      description: "Cost of the project",
      example: '150000'
  }) 
  public cost: number;

  @ApiProperty({
      description: 'Project deadline',
      example: '2024-12-31',
  })
  @IsString()
  public deadline: Date;

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
