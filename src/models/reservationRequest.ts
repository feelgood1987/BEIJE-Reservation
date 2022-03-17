export class ReservationRequest {
  //it should be in HH:mm format
  startTime: string;
  userId: string;
  //If true, 10 minute before call an email should be sent to the user
  receiveEmail: boolean;
  // If true, 5 minute before call an SMS should be sent to the user's phone
  receiveSmsNotification: boolean;
  //If true, one minute before call a push notification should be sent to the user
  receivePushNotification: boolean;
}
