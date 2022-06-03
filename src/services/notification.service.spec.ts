import { NotificationServices } from './notification-service';

xdescribe('Notification service coverage', () => {
  let service: NotificationServices;
  it('should call and retrieve the result for the reservatoin request', async () => {
    expect(service.sendEmail).toHaveBeenCalled();
  });
});
