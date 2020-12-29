import PushNotificationIOS from '@react-native-community/push-notification-ios';

const showNotification = (title, message) => {
  PushNotificationIOS.presentLocalNotification({
    alertTitle: title,
    alertBody: message,
  });
};

const handleScheduleNotification = (title, message) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() * 90000);
  PushNotificationIOS.scheduleLocalNotification({
    alertTitle: title,
    alertBody: message,
    fireDate: date.toISOString(),
  });
};

const handleCancel = () => {
  PushNotificationIOS.removeAllDeliveredNotifications();
};

export {showNotification, handleScheduleNotification, handleCancel};
