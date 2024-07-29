import { Controller, Param, Patch, NotFoundException, InternalServerErrorException, HttpCode, HttpStatus, Res, Response } from '@nestjs/common';
import { ParticipantsService } from '@/http/services/participants.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @ApiOperation({ summary: 'Confirm participants on trip' })
  @ApiParam({ name: 'participantId', description: 'ID of the participant to confirm', type: String })
  @Patch(':participantId/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmParticipant(
    @Response() res: FastifyReply,
    @Param('participantId') participantId: string,
  ): Promise<void> {
    try {
      const participantTripConfirmed = await this.participantsService.confirmParticipant(participantId);

      const userAgent = res.request.headers['user-agent'];

      const isMobile = /mobile/i.test(userAgent);

      if (isMobile) {
        const appUrl = `planner://${participantTripConfirmed}`;
        res.redirect(HttpStatus.PERMANENT_REDIRECT, appUrl);
      } else {
        res.type('text/html');
        res.send('<html><body><h1>Viagem confirmada</h1></body></html>');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to confirm participant: ' + `${error.message}`);
    }
  }
}
