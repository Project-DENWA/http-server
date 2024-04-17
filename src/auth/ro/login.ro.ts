import { ApiProperty } from '@nestjs/swagger';
import { TokensRo } from 'src/auth/ro/tokens.ro';
import ResponseRo from 'src/common/ro/Response.ro';
import { PrivateUser } from 'src/users/ro/private-user.ro';

export class LoginResult {
  @ApiProperty({ description: 'JWT tokens.', type: () => TokensRo })
  readonly tokens: TokensRo;

  @ApiProperty({ description: 'User account data.', type: () => PrivateUser })
  readonly user: PrivateUser;
}

export class LoginRo extends ResponseRo {
  @ApiProperty({
    type: () => LoginResult,
    nullable: false,
  })
  readonly result: LoginResult;
}
