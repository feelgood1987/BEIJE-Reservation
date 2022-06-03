import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sequelize } from 'sequelize-typescript';
import { Reservation, User } from '../entities';
import {
  ReservationRequest,
  ReservationUpdate,
} from '../models';
import { NotificationServices, ReservationService } from '../services';
import { ReservationsController } from './reservations.controller';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationService;
  const sequelize = new Sequelize('Reservation', 'postgres', '1987', {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1987',
    models: [Reservation, User],
  });
  const requestBody: ReservationRequest = {
    userId: '37f3e0b0-8893-487a-ae1d-674af4286c06',
    startTime: '16:45',
    date: new Date(),
    receiveEmail: true,
    receiveSmsNotification: true,
    receivePushNotification: true,
  };
  const requestId: string = 'd31f2e8d-ac90-402d-9a1d-ffb004b58ca0';

  beforeEach(async () => {
    const NotificationMockService = {
      provide: NotificationServices,
      useClass: NotificationServices,
    };
    const ScheduleMockClass = {
      provide: SchedulerRegistry,
      useClass: SchedulerRegistry,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        ReservationService,
        NotificationMockService,
        ScheduleMockClass,
        {
          provide: getRepositoryToken(Reservation),
          useValue: Reservation,
        },
        {
          provide: getRepositoryToken(User),
          useValue: User,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  xdescribe('getReservationRequest', () => {
    it('should call and get value for the reservation', async () => {
      const result = await controller.getSingleReservationResponse(requestId);
      jest
        .spyOn(service, 'getReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.getReservationRequest(requestId)).toBe(result);
      expect(service.getReservationRequest).toHaveBeenCalled();
    });
  });

  xdescribe('getAllReservations', () => {
    it('should retrieve all reservatoin requests', async () => {
      const result = await controller.getReservations();
      jest
        .spyOn(service, 'getReservations')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.getReservations()).toBe(result);
      expect(service.getReservations).toHaveBeenCalled();
    });
  });

  xdescribe('createReservationRequest', () => {
    it('should call and retrieve the result for the reservatoin request', async () => {
      const result = await controller.createReservationRequest(requestBody);
      jest
        .spyOn(service, 'createReservationRequest')
        .mockImplementation(() => Promise.resolve(result));

      expect(await service.createReservationRequest(requestBody)).toBe(result);
      expect(service.createReservationRequest).toHaveBeenCalled();
    });
  });

  xdescribe('cancelReservationRequest', () => {
    it('should cancel the reservation', async () => {
      const result = await controller.cancelRequest(requestId);
      jest
        .spyOn(service, 'cancelReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.cancelReservationRequest(requestId)).toBe(result);
      expect(service.cancelReservationRequest).toHaveBeenCalled();
    });
  });

  xdescribe('updateReservationRequest', () => {
    it('should update the reservatoin.', async () => {
      const reservationUpdate: ReservationUpdate = {
        id: requestId,
        reserveDate: new Date(),
        startTime: '20:30',
      };
      const result = await controller.updateRequest(reservationUpdate);
      jest
        .spyOn(service, 'updateReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.updateReservationRequest(reservationUpdate)).toBe(
        result,
      );
      expect(service.updateReservationRequest).toHaveBeenCalled();
    });
  });

  xdescribe('Accept-Request', () => {
    it('should accept/reject the reservation.', async () => {
      const result = await controller.acceptRequest(requestId);
      jest
        .spyOn(service, 'handleRequests')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.handleRequests(requestId)).toBe(result);
      expect(service.handleRequests).toHaveBeenCalled();
    });
  });

  xdescribe('Reject-Request', () => {
    it('should reject the reservation.', async () => {
      const result = await controller.rejectRequest(requestId);
      jest
        .spyOn(service, 'handleRequests')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.handleRequests(requestId, false)).toBe(result);
      expect(service.handleRequests).toHaveBeenCalled();
    });
  });
});
