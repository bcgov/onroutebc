import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @AutoMap()
  @ApiProperty({
    example: 'Adam',
    description: 'The name of the logged in user.',
    required: true,
  })
  name: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The family name of the logged in user.',
    required: true,
  })
  family_name: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The family name of the logged in user.',
    required: true,
  })
  given_name: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The display name of the logged in user.',
    required: true,
  })
  display_name: string;

  @AutoMap()
  @ApiProperty({
    example: 'bceidboth',
    description: 'The identity provider of the logged in user.',
    required: true,
  })
  identity_provider: string;

  @AutoMap()
  @ApiProperty({
    example: 'openid idir bceidboth email profil',
    description: 'The scope of the logged in user.',
    required: true,
  })
  scope: string;

  @AutoMap()
  @ApiProperty({
    example: 'on-route-bc-direct-4598',
    description: 'IDP(keycloak) client id the logged in user.',
    required: true,
  })
  azp: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The preferred user name of the logged in user.',
    required: true,
  })
  preferred_username: string;

  @AutoMap()
  @ApiProperty({
    example: '06267945F2EB4E31B585932F78B76269',
    description: 'The user guid of the logged in user',
    required: true,
  })
  bceid_user_guid: string;

  @AutoMap()
  @ApiProperty({
    example: '06267945F2EB4E31B585932F78B76269',
    description: 'The username of the logged in user',
    required: true,
  })
  bceid_username: string;

  @AutoMap()
  @ApiProperty({
    example: '06267945F2EB4E31B585932F78B76269',
    description: 'The company guid of the logged in user',
    required: true,
  })
  companyguid: string;

  @AutoMap()
  @ApiProperty({
    example: '0ee00acd-ee0e-46a0-8ccd-1e11f18e867a',
    description: 'unique identifier of jwt',
    required: true,
  })
  jti: string;

  @AutoMap()
  @ApiProperty({
    example: '1677085840',
    description: 'Time when authentication occured',
    required: true,
  })
  auth_time: bigint;

  @AutoMap()
  @ApiProperty({
    example: '1677086376',
    description: 'Time at which token was issues',
    required: true,
  })
  iat: bigint;

  @AutoMap()
  @ApiProperty({
    example: '1677086676',
    description: 'Expiration time of token',
    required: true,
  })
  exp: bigint;

  @AutoMap()
  @ApiProperty({
    example: '1677086676',
    description: 'Email of logged in user',
    required: true,
  })
  email: string;
}
