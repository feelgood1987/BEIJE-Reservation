import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationsController } from 'src/controllers';
import { ReservationService } from 'src/services';
import { Reservation } from './reservation-entity';
import { User } from './user-entity';

@Module({
  imports: [SequelizeModule.forFeature([Reservation, User])],
  providers: [ReservationService],
  controllers: [ReservationsController],
})
export class ReservationModule {}
