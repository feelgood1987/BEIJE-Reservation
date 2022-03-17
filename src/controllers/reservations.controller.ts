import { Controller, Post } from '@nestjs/common';
import { Reservation } from 'src/entities';
import { CreateReservationResponse } from 'src/models';
import { ReservationService } from 'src/services/reservation.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservationRequest(): Promise<CreateReservationResponse> {
    let entity = new Reservation();
    entity.userId = 'test';
    entity.startDate = new Date();
    entity.receiveEmail = true;
    entity.startTime = '22:15';
    return this.reservationService.createReservationRequest(entity);
  }
}
