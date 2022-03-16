import { Controller } from '@nestjs/common';
import { ReservationService } from 'src/services/reservation.service';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly appService: ReservationService) {}

}
