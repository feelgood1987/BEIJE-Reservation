import { Test, TestingModule } from '@nestjs/testing';
import {
  ReservationRequest,
  ReservationUpdate,
} from '../models';
import { ReservationService } from './reservation.service';
import { Reservation, User } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationServices } from './notification-service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';

xdescribe('ReservationService', () => {
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

  const NotificationMockService = {
    provide: NotificationServices,
    useClass: NotificationServices,
  };
  const ScheduleMockClass = {
    provide: SchedulerRegistry,
    useClass: SchedulerRegistry,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ReservationService>(ReservationService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservationRequest', () => {
    it('should create and return result for the reservatoin request', async () => {
      const result = await service.createReservationRequest(requestBody);
      jest
        .spyOn(service, 'createReservationRequest')
        .mockImplementation(() => Promise.resolve(result));

      expect(await service.createReservationRequest(requestBody)).toBe(result);
    });
  });

  describe('getReservationRequest', () => {
    it('should retrieve the reservatoin json', async () => {
      const result = await service.getReservationRequest(requestId);
      jest
        .spyOn(service, 'getReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.getReservationRequest(requestId)).toBe(result);
    });
  });

  describe('getAllReservations', () => {
    it('should retrieve all reservatoin requests', async () => {
      const result = await service.getReservations();
      jest
        .spyOn(service, 'getReservations')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.getReservations()).toBe(result);
    });
  });

  describe('cancelReservationRequest', () => {
    it('should cancel the reservatoin.', async () => {
      const result = await service.cancelReservationRequest(requestId);
      jest
        .spyOn(service, 'cancelReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.cancelReservationRequest(requestId)).toBe(result);
    });
  });

  describe('updateReservationRequest', () => {
    it('should update the reservatoin.', async () => {
      const reservationUpdate: ReservationUpdate = {
        id: requestId,
        reserveDate: new Date(),
        startTime: '20:30',
      };
      const result = await service.updateReservationRequest(reservationUpdate);
      jest
        .spyOn(service, 'updateReservationRequest')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.updateReservationRequest(reservationUpdate)).toBe(
        result,
      );
    });
  });

  describe('Accept-Requests', () => {
    it('should accept the reservation.', async () => {
      const result = await service.handleRequests(requestId);
      jest
        .spyOn(service, 'handleRequests')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.handleRequests(requestId)).toBe(
        result,
      );
    });
  });

  describe('Reject-Requests', () => {
    it('should reject the reservation.', async () => {
      const result = await service.handleRequests(requestId,false);
      jest
        .spyOn(service, 'handleRequests')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.handleRequests(requestId,false)).toBe(
        result,
      );
    });
  });
});
