import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';
import { Reservation, User } from 'src/entities';
import {
  CreateReservationResponse,
  ReservationRequest,
  ReservationResponse,
  ReservationStatus,
  ReservationUpdate,
} from 'src/models';
import { Op } from 'sequelize';

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
      // Check if user exists
      if (!(await this.userModel.findByPk(requestBody.userId))) {
        return new CreateReservationResponse({
          status: 'error',
          message: 'Requester user does not exists ',
        });
      }
      // Check if any appointments already exists
      const list = await this.reservationModel.findAndCountAll({
        where: {
          startDate: {
            [Op.eq]: new Date(requestBody.date).toISOString(),
          },
          startTime: requestBody.startTime,
          [Op.or]: [
            { status: ReservationStatus.QUEUED },
            { status: ReservationStatus.SUCCESSFUL },
          ],
        },
      });
      if (list.count > 0) {
        return new CreateReservationResponse({
          status: 'error',
          message: 'The Appointment Time already reserved by another user.',
        });
      }

      // Create new reservation
      const reservation = await this.reservationModel.create({
        id: uuid(),
        userId: requestBody.userId,
        startDate: requestBody.date,
        receiveEmail: requestBody.receiveEmail,
        startTime: requestBody.startTime,
        receivePushNotification: requestBody.receivePushNotification,
        receiveSmsNotification: requestBody.receiveSmsNotification,
        status: ReservationStatus.QUEUED,
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

  async getReservationRequest(id: string): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findByPk(id);
    // Check if the reservation exists
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }
    return this.getSingleReservationResponse(reservation);
  }

  async getReservations(): Promise<ReservationResponse[]> {
    const reservation = await this.reservationModel.findAll();
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }
    let reponseList: ReservationResponse[] = [];
    for (const request of reservation) {
      reponseList.push(await this.getSingleReservationResponse(request));
    }
    return reponseList;
  }

  async cancelReservationRequest(id: string): Promise<ReservationResponse> {
    let reservation = await this.reservationModel.findByPk(id);
    // Check if the reservation exists
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }
    // Check if reservation already Canceled
    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new HttpException(
        'Reservation already has been canceled',
        HttpStatus.BAD_REQUEST,
      );
    }
    reservation.status = ReservationStatus.CANCELLED;
    // Update Reservation status to Canceled
    const result = await this.reservationModel.update(
      {
        status: reservation.status,
      },
      {
        where: {
          id: id,
        },
      },
    );
    if (result[0] > 0) {
      // Send inform email to admin
      return this.getSingleReservationResponse(reservation);
    } else {
      throw new HttpException('Cancel failed', HttpStatus.BAD_REQUEST);
    }
  }

  async handleRequests(
    id: string,
    acceptRequest: boolean = true,
  ): Promise<ReservationResponse> {
    let reservation = await this.reservationModel.findByPk(id);
    // Check if the reservation exists
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }
    // Check if reservation already processed, status should be changed from QUEUED
    if (reservation.status !== ReservationStatus.QUEUED) {
      throw new HttpException(
        'Reservation status already has been processed',
        HttpStatus.BAD_REQUEST,
      );
    }
    reservation.status = acceptRequest
      ? ReservationStatus.SUCCESSFUL
      : ReservationStatus.REJECTED;
    // Update Reservation status
    const result = await this.reservationModel.update(
      {
        status: reservation.status,
      },
      {
        where: {
          id: id,
        },
      },
    );
    if (result[0] > 0) {
      // Send inform email to user
      return this.getSingleReservationResponse(reservation);
    } else {
      throw new HttpException('Operation failed', HttpStatus.BAD_REQUEST);
    }
  }

  async updateReservationRequest(
    requestBody: ReservationUpdate,
  ): Promise<CreateReservationResponse> {
    let reservation = await this.reservationModel.findByPk(requestBody.id);
    // Check if the reservation exists
    if (!reservation) {
      return new CreateReservationResponse({
        status: 'error',
        message: 'Reservation not found',
      });
    }
    // Check if reservation already Canceled
    if (
      reservation.status === ReservationStatus.CANCELLED ||
      reservation.status === ReservationStatus.REJECTED
    ) {
      return new CreateReservationResponse({
        status: 'error',
        message: 'Reservation could not be updated bacause of its status',
      });
    }
    // Check if new Date and time is free to reserve
    const list = await this.reservationModel.findAndCountAll({
      where: {
        startDate: {
          [Op.eq]: new Date(requestBody.reserveDate).toISOString(),
        },
        startTime: requestBody.startTime,
        [Op.or]: [
          { status: ReservationStatus.QUEUED },
          { status: ReservationStatus.SUCCESSFUL },
        ],
      },
    });
    if (list.count > 0) {
      return new CreateReservationResponse({
        status: 'error',
        message: 'The Appointment Time already reserved by another user.',
      });
    }
    // Update Reservation status to QUEUED and reserve data time
    reservation.status = ReservationStatus.QUEUED;
    reservation.startDate = requestBody.reserveDate;
    reservation.startTime = requestBody.startTime;
    const result = await this.reservationModel.update(
      {
        status: reservation.status,
        startDate: reservation.startDate,
        startTime: reservation.startTime,
      },
      {
        where: {
          id: requestBody.id,
        },
      },
    );
    if (result[0] > 0) {
      // Send inform email to admin
      return new CreateReservationResponse({
        status: 'success',
        record: await this.getSingleReservationResponse(reservation),
      });
    } else {
      return new CreateReservationResponse({
        status: 'error',
        message: 'The Appointment update operation failed.',
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
      status: reservation.status,
      pushNotificationKey: user.pushNotificationKey,
      date: reservation.startDate.toISOString(),
      endTime: this.getEndTime(reservation.startTime),
      createdTime: reservation.createdAt,
    });
  }

  private getEndTime(startTime: string): string {
    try {
      const splitedTime: string[] = startTime.split(':');
      const endTime: number = parseInt(splitedTime[1]) + 15;
      return splitedTime[0] + ':' + (endTime >= 60 ? '00' : endTime);
    } catch (error) {
      return startTime;
    }
  }
}
