import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/providers/prisma.service';
import { env } from '@/env';
import { CreateParticipantDto } from '../dtos/participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async confirmParticipant(participantId: string): Promise<string> {
    const participant = await this.prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    await this.prisma.participant.update({
      where: { id: participantId },
      data: {
        is_confirmed: true,
      },
    });

    const currentTrip = await this.prisma.trip.findUnique({
      where: { id: participant.trip_id },
    });

    return `/trip/${currentTrip.id}`
  }
}
