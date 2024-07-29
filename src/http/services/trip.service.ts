import { BadRequestException, NotAcceptableException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/providers/prisma.service";
import { Participant, Prisma, Trip } from "@prisma/client";
// import { DayJsProvider } from "@/common/providers/dayjs.provider";
import { CreateTripDto, TripDto } from "@/http/dtos/trip.dto";
import { CreateParticipantDto } from "../dtos/participant.dto";
import { DtoTripSchema } from "@/common/schemas/trip.schema";
import { UserAuth } from "@/http/dtos/user.dto";
import { MailService } from "@/common/providers/mail.service";
import { formatDate } from "@/utils/date";
import { env } from "@/env";

@Injectable()
export class TripsService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly dayJs: DayJsProvider,
    private readonly mail: MailService
  ) { }

  async createTrip(currentUser: UserAuth, tripDto: CreateTripDto): Promise<TripDto> {
    // Validação usando o TripSchema
    const { invites, ...validatedTripDetails } = DtoTripSchema.parse(tripDto);
    
    try {
      const { created_at, ...tripCreated } = await this.prisma.trip.create({
        data: {
          participants: {
            create: {
              user: {
                connect: {
                  id: currentUser.userId,
                },
              },
              is_confirmed: true,
              is_owner: true,
            },
          },
          ...validatedTripDetails,
          starts_at: new Date(validatedTripDetails.starts_at),
          ends_at: new Date(validatedTripDetails.ends_at),
          destination: validatedTripDetails.destination,
          is_confirmed: validatedTripDetails.is_confirmed ?? false,
        },
      });

      invites.forEach(invite => {
        if (invite.email && invite.name) {
          this.inviteParticipant(
            currentUser,
            tripCreated.id, 
            {
            email: invite.email,
            name: invite.name,
            is_owner: invite.is_owner,
          })
        }
      })

      return {
        invites: invites.map(invite => {
          return {
            email: invite.email,
            name: invite.name,
            is_owner: invite.is_owner,
          }
        }),
        ...tripCreated,
      };

    } catch (error) {
      throw this.prisma.handlePrismaError(error);
    }
  }

  async getTripDetails(tripId: string): Promise<Partial<Trip>> {
    try {
      const trip = await this.prisma.trip.findUnique({
        select: {
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true,
          is_concluded: true,
        },
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException('Trip not found.');
      }

      return trip;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw this.prisma.handlePrismaError(error);
    }
  }

  async getTrips(): Promise<Partial<Trip>[]> {
    try {
      const trips = await this.prisma.trip.findMany({
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true,
          is_concluded: true,
        },
      });

      if (!trips || trips.length === 0) {
        throw new NotFoundException('Trips not found.');
      }

      return trips;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateTrip(tripId: string, tripDto: CreateTripDto): Promise<Trip> {
    const updateSchema = DtoTripSchema.partial();

    // Validação usando o esquema atualizado
    const validatedTrip = updateSchema.parse(tripDto);

    const trip = await this.prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }

    await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        ...validatedTrip,
        starts_at: validatedTrip.starts_at ? new Date(validatedTrip.starts_at) : undefined,
        ends_at: validatedTrip.ends_at ? new Date(validatedTrip.ends_at) : undefined,
      },
    });

    return trip
  }

  async deleteTrip(tripId: string): Promise<void> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }

    await this.prisma.trip.delete({
      where: { id: tripId },
    });
  }

  // async confirmTrip(tripId: string): Promise<void> {
  //   const trip = await this.prisma.trip.findUnique({
  //     where: { id: tripId },
  //     include: {
  //       participants: {
  //         where: { is_owner: false },
  //       },
  //     },
  //   });

  //   if (!trip) {
  //     throw new NotFoundException('Trip not found');
  //   }

  //   if (trip.is_confirmed) {
  //     return; // A viagem já está confirmada, nada a fazer
  //   }

  //   await this.prisma.trip.update({
  //     where: { id: tripId },
  //     data: { is_confirmed: true },
  //   });

  //   const mail = await getMailClient();
  //   const formattedTripStartDate = this.dayjs.instantiate(trip.starts_at).format('D[ de ]MMMM');
  //   const formattedTripEndDate = this.dayjs.instantiate(trip.ends_at).format('D[ de ]MMMM');

  //   try {
  //     await Promise.all(
  //       trip.participants.map(async (participant) => {
  //         const confirmationLink = new URL(`/trips/${trip.id}/confirm/${participant.id}`, process.env.WEB_BASE_URL);

  //         const message = await mail.sendMail({
  //           from: {
  //             name: 'Equipe plann.er',
  //             address: 'josepsousa2012@gmail.com',
  //           },
  //           to: participant.email,
  //           subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedTripStartDate}`,
  //           html: `
  //             <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
  //               <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedTripStartDate} até ${formattedTripEndDate}</strong>.</p>
  //               <p></p>
  //               <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
  //               <p></p>
  //               <p>
  //                 <a href="${confirmationLink.toString()}">Confirmar viagem</a>
  //               </p>
  //               <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
  //             </div>
  //           `.trim(),
  //         });

  //         return
  //         // console.log(nodemailer.getTestMessageUrl(message));
  //       }),
  //     );
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to send confirmation emails');
  //   }
  // }

  async inviteParticipant(currentUser: UserAuth, tripId: string, participantDto: CreateParticipantDto): Promise<void> {
    if (currentUser.email === participantDto.email) {
      throw new BadRequestException('You cannot invite yourself');
    }

    try {
      const trip = await this.prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException('Trip not found');
      }


      // Verifica se o usuário está na viagem
      const userInTrip = await this.prisma.participant.findFirst({
        where: {
          user_id: currentUser.userId,
          trip_id: tripId,
        },
      });

      if (!userInTrip) {
        throw new NotAcceptableException(`${currentUser.email} You are not a participant in this trip`);
      }

      // Verifica se já existe um participante com o mesmo e-mail para a mesma viagem
      const existingParticipant = await this.prisma.participant.findFirst({
        where: {
          user: { email: participantDto.email },
          trip_id: tripId,
        },
      });

      if (existingParticipant) {
        throw new NotAcceptableException('Participant with this email already exists in the trip');
      }

      const user = await this.prisma.user.upsert({
        where: { email: participantDto.email },
        update: {},
        create: {
          name: participantDto.name,
          email: participantDto.email,
        },
      });

      const participant = await this.prisma.participant.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          trip: {
            connect: { id: tripId },
          },
          is_owner: participantDto.is_owner,
          is_invited: !participantDto.is_owner,
          is_confirmed: false,
        },
      });

      // const mail = await getMailClient()

      const formattedTripStartDate = formatDate(trip.starts_at)
      const formattedTripEndDate = formatDate(trip.ends_at)

      const confirmationLink = new URL(
        `${env.API_BASE_URL}/participants/${participant.id}/confirm`,
      )

      //TODO isso provavelmente pode dar um erro caso ocorra algo no envio do email
      // o participante foi criado mas nunca recebeu o email de confirmação
      const message = await this.mail.sendMail({
        to: user.email,
        subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedTripStartDate}`,
        html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedTripStartDate} até ${formattedTripEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
          <p></p>
          <button style="width: 40px; height: auto; padding: 5px 2px; color: 'white'; background-color: '#202020'">
            <a target='_blank' href="${confirmationLink.toString()}">Confirmar viagem</a>
          </button>
          <p>Caso você não saiba do que se trata, apenas ignore esse e-mail.</p>
        </div>
      `.trim(),

      })

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        || error instanceof Prisma.PrismaClientUnknownRequestError
      ) {
        throw this.prisma.handlePrismaError(error);
      }
      throw error;
    }
  }

  async getTripParticipantsDetails(tripId: string): Promise<Participant[]> {
    const participants = await this.prisma.participant.findMany({
      where: { trip_id: tripId },
      include: { user: false },
    });

    return participants
  }
}
