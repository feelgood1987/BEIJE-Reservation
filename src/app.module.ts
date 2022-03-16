import { Module } from '@nestjs/common';
import { ReservationsController } from './controllers';
import { ReservationService } from './services';

@Module({
  imports: [],
  controllers: [ReservationsController],
  providers: [ ReservationService],
})
export class AppModule {}
