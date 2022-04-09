import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationsController } from '../controllers';
import { NotificationServices, ReservationService } from '../services';
import { Reservation } from './reservation-entity';
import { User } from './user-entity';

@Module({
  imports: [SequelizeModule.forFeature([Reservation, User])],
  providers: [ReservationService,NotificationServices],
  controllers: [ReservationsController],
})
export class ReservationModule {}
