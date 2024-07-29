import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TripsService } from "../services/trip.service";
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateTripSchema, UpdateTripSchema } from '@/common/schemas/trip.schema';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateTripDto, TripDto } from "@/http/dtos/trip.dto";
import { CreateParticipantDto } from "../dtos/participant.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { FastifyRequest } from "@/common/schemas/user.request";
import { CreateParticipantSchema } from "@/common/schemas/participant.schema";

@Controller("trips")
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @UseGuards(AuthGuard)
  @ApiTags("participants")
  @ApiOperation({ summary: 'Invite a user to a trip' })
  @ApiParam({ name: 'tripId', type: String, description: 'UUID of the trip' })
  @ApiBody({ type: CreateParticipantDto })
  @Post(':tripId/invites')
  async inviteUserToTrip(
    @Req() req: FastifyRequest,
    @Param('tripId') tripId: string,
    @Body(new ZodValidationPipe(CreateParticipantSchema)) participantDto: CreateParticipantDto
  ): Promise<void> {
    await this.tripsService.inviteParticipant(req.user, tripId, participantDto)
  }

  @UseGuards(AuthGuard)
  @ApiTags('participants')
  @ApiOperation({ summary: 'Get trip participants details' })
  @ApiParam({ name: 'tripId', type: String, description: 'UUID of the trip' })
  @Get(':tripId/participants')
  async getTripParticipants(
    @Req() req: FastifyRequest,
    @Param('tripId') tripId: string
  ): Promise<void> {
    await this.tripsService.getTripParticipantsDetails(tripId)
  }

  @UseGuards(AuthGuard)
  @ApiTags("trips")
  @ApiOperation({
    summary: 'Create a new trip',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTrip(
    @Req() req: FastifyRequest,
    @Body(new ZodValidationPipe(CreateTripSchema)) tripDto: CreateTripDto
  ): Promise<TripDto> {
    return this.tripsService.createTrip(req.user, tripDto);
  }

  @UseGuards(AuthGuard)
  @ApiTags("trips")
  @ApiOperation({ summary: 'Get a trip details' })
  @ApiParam({ name: 'tripId', type: String, description: 'UUID of the trip' })
  @Get(':tripId')
  async getTripDetails(@Param('tripId', ZodValidationPipe) tripId: string): Promise<Partial<TripDto>> {
    return this.tripsService.getTripDetails(tripId);
  }

  @UseGuards(AuthGuard)
  @ApiTags("trips")
  @ApiOperation({ summary: 'Get all trips' })
  @Get()
  async getTrips(): Promise<Partial<TripDto>[]> {
    return this.tripsService.getTrips();
  }

  @UseGuards(AuthGuard)
  @ApiTags("trips")
  @ApiOperation({ summary: 'Update a trip' })
  @ApiParam({ name: 'tripId', type: String, description: 'UUID of the trip' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The trip has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Put(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateTrip(
    @Param('tripId', ZodValidationPipe) { tripId }: { tripId: string },
    @Body(new ZodValidationPipe(UpdateTripSchema)) tripDto: CreateTripDto
  ): Promise<void> {
    await this.tripsService.updateTrip(tripId, tripDto);
  }

  @UseGuards(AuthGuard)
  @ApiTags("trips")
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The trip has been successfully deleted.' })
  @Delete(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrip(@Param('tripId', ZodValidationPipe) tripId: string): Promise<void> {
    await this.tripsService.deleteTrip(tripId);
  }

}
