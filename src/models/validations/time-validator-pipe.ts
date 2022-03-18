import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsReservationTime', async: true })
@Injectable()
export class TimeValidator implements ValidatorConstraintInterface {
  async validate(value: string) {
    try {
      if (value.length === 5) {
        const time = value.split(':');
        if (!time || time.length !== 2) {
          return false;
        }
        const hour=+time[0];
        const minute=+time[1];
        const validMinutes:number[]=[0,15,30,45]
        // Check hour format
        if(hour<0 || hour>23){
            return false;
        }

        // Check minute format
        if(!validMinutes.includes(minute)){
            return false;
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Reservation Time is not valid, it should be in HH:mm format, Sample: 13:15';
  }
}

export function IsReservationTime(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsReservationTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: TimeValidator,
    });
  };
}
