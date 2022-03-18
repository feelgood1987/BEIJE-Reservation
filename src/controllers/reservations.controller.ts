import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  CreateReservationResponse,
  ReservationRequest,
  ReservationResponse,
  ReservationUpdate,
  ValidationPipe,
} from 'src/models';
import { ReservationService } from 'src/services/reservation.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservationRequest(
    @Body(new ValidationPipe()) requestBody: ReservationRequest,
  ): Promise<CreateReservationResponse> {
    return this.reservationService.createReservationRequest(requestBody);
  }

  @Get(':id')
  async getSingleReservationResponse(
    @Param('id') id: string,
  ): Promise<ReservationResponse> {
    return this.reservationService.getReservationRequest(id);
  }

  @Get()
  async getReservations(): Promise<ReservationResponse[]> {
    return this.reservationService.getReservations();
  }

  @Put('cancel-request/:id')
  async cancelRequest(@Param('id') id: string): Promise<ReservationResponse> {
    return this.reservationService.cancelReservationRequest(id);
  }

  @Put('update-request')
  async updateRequest(
    @Body(new ValidationPipe()) requestBody: ReservationUpdate,
  ): Promise<CreateReservationResponse> {
    return this.reservationService.updateReservationRequest(requestBody);
  }

  @Put('accept-request/:id')
  async rejectRequest(@Param('id') id: string): Promise<ReservationResponse> {
    return this.reservationService.handleRequests(id);
  }

  @Put('reject-request/:id')
  async acceptRequest(@Param('id') id: string): Promise<ReservationResponse> {
    return this.reservationService.handleRequests(id, false);
  }
}
