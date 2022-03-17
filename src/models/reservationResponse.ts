import { Model } from 'sequelize-typescript';
import { ReservationStatus } from './reservationStatus';

export class ReservationResponse {
  constructor(data?: Partial<ReservationResponse>) {
    if (!data) {
      return;
    }
    this.status = data.status;
    this.id = data.id;
    this.email = data.email;
    this.phone = data.phone;
    this.pushNotificationKey = data.pushNotificationKey;
    this.endTime = data.endTime;
    this.createdTime = data.createdTime;
  }
  id: string;
  startTime: string;
  email: string;
  phone: string;
  pushNotificationKey: string;
  endTime: string;
  status: ReservationStatus;
  createdTime: string;
}
