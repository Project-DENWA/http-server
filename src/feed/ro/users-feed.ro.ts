import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PublicUser } from "src/users/ro/public-user.ro";

export class UsersFeedRo {
    @ApiProperty({
      nullable: false,
      type: () => PublicUser,
      isArray: true,
    })
    @Type(() => PublicUser)
    readonly result: readonly PublicUser[];
  }
  