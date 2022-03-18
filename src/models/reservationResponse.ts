import { ReservationStatus } from './reservationStatus';
export class ReservationResponse {
  constructor(data?: Partial<ReservationResponse>) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.email = data.email;
    this.phone = data.phone;
    this.pushNotificationKey = data.pushNotificationKey;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.createdTime = data.createdTime;
    this.status = data.status;
  }
  id: string;
  startTime: string;
  date: string;
  email: string;
  phone: string;
  pushNotificationKey: string;
  endTime: string;
  status: ReservationStatus;
  createdTime: string;
}
