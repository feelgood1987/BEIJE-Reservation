import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ReservationStatus } from 'src/models';

@Table
export class Reservation extends Model<Reservation> {
  constructor(data?: Reservation) {
    super(data);
  }

  @PrimaryKey
  @Column
  id: string;

  @Column
  startDate: Date;

  @Column
  startTime: string;

  @Column
  userId: string;

  @Column
  receiveEmail: boolean;

  @Column
  receiveSmsNotification: boolean;

  @Column
  receivePushNotification: boolean;

  @Column
  status: ReservationStatus;
}
