import { ApiProperty, OmitType } from "@nestjs/swagger";
import { User } from "@prisma/client";

class ParticipantToInvite {
  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Define se o usuário é o dono da viagem' })
  is_owner: boolean
}

class TripDto {
  // @ApiProperty({ description: 'ID do usuário' })
  // user_id: string;
  @ApiProperty({ description: 'ID da viagem' })
  id: string;

  @ApiProperty({ description: 'Local de destino' })
  destination: string;

  @ApiProperty({ description: 'Data de partida' })
  starts_at: Date;
  
  @ApiProperty({ description: 'Data de retorno' })
  ends_at: Date;

  @ApiProperty({ description: 'Confirmação da viagem' })
  is_confirmed: boolean;
  
  @ApiProperty({ description: 'Define se a viagem já aconteceu e está concluída' })
  is_concluded: boolean;

  @ApiProperty({ description: 'Lista de emails para convidar' })
  invites: ParticipantToInvite[];
}

// class TripParticipants {
//   user: User

// }

// Cria um DTO omitindo a propriedade `is_confirmed`
class CreateTripDto extends OmitType(TripDto, ['is_confirmed', 'is_concluded', 'id'] as const) {}

export { TripDto, CreateTripDto };
