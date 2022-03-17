import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';
import { Reservation, User } from 'src/entities';
import {
  CreateReservationResponse,
  ReservationRequest,
  ReservationResponse,
} from 'src/models';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation) private reservationModel: typeof Reservation,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async createReservationRequest(
    requestBody: ReservationRequest,
  ): Promise<CreateReservationResponse> {
    try {
      const reservation = await this.reservationModel.create({
        id: uuid(),
        userId: requestBody.userId,
        receiveEmail: requestBody.receiveEmail,
        startTime: requestBody.startTime,
      });

      return new CreateReservationResponse({
        status: 'success',
        record: await this.getSingleReservationResponse(reservation),
      });
    } catch (error) {
      return new CreateReservationResponse({
        status: 'error',
        message: 'Error on create reservation request: ' + error,
      });
    }
  }

  private async getSingleReservationResponse(
    reservation: Reservation,
  ): Promise<ReservationResponse> {
    const user = await this.userModel.findByPk(reservation.userId);
    return new ReservationResponse({
      id: reservation.id,
      startTime: reservation.startTime,
      email: user.email,
      phone: user.phone,
      pushNotificationKey: user.pushNotificationKey,
      endTime: reservation.startTime,
      createdTime: reservation.createdAt,
    });
  }
}
