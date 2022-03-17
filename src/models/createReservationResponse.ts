import { ReservationResponse } from './reservationResponse';

export class CreateReservationResponse {
  constructor(data?: Partial<CreateReservationResponse>) {
    if (!data) {
      return;
    }
    this.status = data.status;
    this.record = data.record;
    this.message = data.message;
  }
  status: 'success' | 'error';
  record: ReservationResponse;
  message?: string;
}
