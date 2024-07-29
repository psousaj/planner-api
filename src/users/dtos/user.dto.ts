import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email do usuário', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'Imagem do perfil', example: 'https://example.com/image.jpg', required: false })
  image?: string;

  @ApiProperty({ description: 'Provedor de autenticação social', example: 'google', required: false })
  socialProvider?: string;

  @ApiProperty({ description: 'ID do provedor social', example: 'google-id-12345', required: false })
  socialProviderId?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'Imagem do perfil', example: 'https://example.com/image.jpg', required: false })
  image?: string;

  @ApiProperty({ description: 'Provedor de autenticação social', example: 'google', required: false })
  socialProvider?: string;

  @ApiProperty({ description: 'ID do provedor social', example: 'google-id-12345', required: false })
  socialProviderId?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid-1234' })
  id: string;

  @ApiProperty({ description: 'Email do usuário', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'Imagem do perfil', example: 'https://example.com/image.jpg', required: false })
  image?: string;

  @ApiProperty({ description: 'Provedor de autenticação social', example: 'google', required: false })
  socialProvider?: string;

  @ApiProperty({ description: 'ID do provedor social', example: 'google-id-12345', required: false })
  socialProviderId?: string;

  @ApiProperty({ description: 'Data de criação', example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2022-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
