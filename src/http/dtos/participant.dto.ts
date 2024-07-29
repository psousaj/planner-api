import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ description: 'Nome do participante', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'Email do participante', example: 'john.doe@example.com' })
  email: string;

  // @ApiProperty({ description: 'Indica se o participante foi convidado', example: true, required: false })
  // is_invited: boolean

  @ApiProperty({ description: 'Indica se o participante é o dono da viagem', example: true, required: false })
  is_owner: boolean

  // @ApiProperty({ description: 'ID da viagem', example: 'uuid-1234' })
  // trip_id: string;
}
