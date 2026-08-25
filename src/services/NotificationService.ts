import notifee, { TriggerType, TimestampTrigger, RepeatFrequency, AndroidImportance } from '@notifee/react-native';

export class NotificationService {
  static async requestPermissions() {
    return await notifee.requestPermission();
  }

  static async createChannel() {
    await notifee.createChannel({
      id: 'medicine-reminders',
      name: 'Medicine Reminders',
      importance: AndroidImportance.HIGH,
    });
  }

  static async scheduleMedicineReminder(id: string, name: string, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const date = new Date(Date.now());
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id,
        title: 'Time for your medicine',
        body: `It's time to take ${name}.`,
        android: {
          channelId: 'medicine-reminders',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
  }

  static async cancelMedicineReminder(id: string) {
    await notifee.cancelNotification(id);
  }
}
