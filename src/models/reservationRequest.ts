import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsReservationTime } from './validations/time-validator-pipe';

export class ReservationRequest {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsReservationTime()
  startTime: string;

  @IsUUID('all')
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsNotEmpty()
  receiveEmail: boolean;

  @IsBoolean()
  @IsNotEmpty()
  receiveSmsNotification: boolean;

  @IsBoolean()
  @IsNotEmpty()
  receivePushNotification: boolean;
}
