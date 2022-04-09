import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Reservation } from 'src/entities';

@Injectable()
export class NotificationServices {
  private _schedulerRegistry: SchedulerRegistry;

  setSchedulerRegistery(schedulerRegistry: SchedulerRegistry) {
    this._schedulerRegistry = schedulerRegistry;
  }

  async sendEmail(receiver: string, content: string) {
    console.log('Send Email to ' + receiver + ', content:' + content);
  }

  async sendSms(receiver: string, content: string): Promise<void> {
    console.log('Send SMS to ' + receiver + ', content:' + content);
  }

  async createNotificationJob(
    reservation: Reservation,
    email: string,
    phone: string,
  ) {
    try {
      const time: string[] = reservation.startTime.split(':');
      const hour: number = +time[0];
      const minute: number = +time[1];

      // Check email scheduling status
      if (reservation.receiveEmail) {
        const emailSendDate = new Date(
          reservation.startDate.getFullYear(),
          reservation.startDate.getMonth(),
          reservation.startDate.getDay(),
          minute === 0 ? hour - 1 : hour,
          minute === 0 ? 50 : minute - 10,
        );
        const job = new CronJob(emailSendDate, () => {
          this.sendEmail(
            email,
            'Your reservation call will be start in 10 minutes',
          );
        });
        this._schedulerRegistry.addCronJob(
          'EmailSenderJob_' + reservation.id,
          job,
        );
        job.start();
      }
      // Check SMS scheduling status
      if (reservation.receiveSmsNotification) {
        const emailSendDate = new Date(
          reservation.startDate.getFullYear(),
          reservation.startDate.getMonth(),
          reservation.startDate.getDay(),
          minute === 0 ? hour - 1 : hour,
          minute === 0 ? 55 : minute - 5,
        );
        const job = new CronJob(emailSendDate, () => {
          this.sendSms(
            email,
            'Your reservation call will be start in 5 minutes',
          );
        });
        this._schedulerRegistry.addCronJob(
          'EmailSenderJob_' + reservation.id,
          job,
        );
        job.start();
      }
      // Check Push notification scheduling status
      if (reservation.receivePushNotification) {
        const emailSendDate = new Date(
          reservation.startDate.getFullYear(),
          reservation.startDate.getMonth(),
          reservation.startDate.getDay(),
          minute === 0 ? hour - 1 : hour,
          minute === 0 ? 59 : minute - 1,
        );
        const job = new CronJob(emailSendDate, () => {
          this.sendSms(
            email,
            'Your reservation call will be start in 1 minutes',
          );
        });
        this._schedulerRegistry.addCronJob(
          'EmailSenderJob_' + reservation.id,
          job,
        );
        job.start();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
