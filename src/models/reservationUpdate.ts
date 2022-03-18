import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  IsReservationTime,
} from './validations/time-validator-pipe';

export class ReservationUpdate {
  @IsUUID('all')
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  reserveDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsReservationTime()
  startTime: string;
}
