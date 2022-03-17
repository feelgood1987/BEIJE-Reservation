import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reservation, User } from './entities';
import { ReservationModule } from './entities/reservation.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1987',
      database: 'Reservation',
      autoLoadModels: true,
      synchronize: true,
      models: [Reservation, User],
    }),
    ReservationModule,
  ],
})
export class AppModule {}
