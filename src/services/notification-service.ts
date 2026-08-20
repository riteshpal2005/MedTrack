import notifee, { TriggerType, RepeatFrequency, AndroidImportance } from '@notifee/react-native';
import { RoutineTask } from '../store/routine-store';

export async function requestNotificationPermission() {
  await notifee.requestPermission();
}

/**
 * Parses a time string like "08:00 AM" into hours (0-23) and minutes.
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  try {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);

    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;

    return { hours: h, minutes: m };
  } catch (e) {
    // Default to 8 AM if parsing fails
    return { hours: 8, minutes: 0 };
  }
}

export async function scheduleSkincareReminders(tasks: RoutineTask[]) {
  // First, cancel all previously scheduled notifications to avoid duplicates
  await notifee.cancelAllNotifications();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'routines',
    name: 'Daily Routines',
    importance: AndroidImportance.HIGH,
  });

  for (const task of tasks) {
    const { hours, minutes } = parseTime(task.time);

    // Create a date object for the next occurrence of this time
    const date = new Date(Date.now());
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    // If the time has already passed today, schedule for tomorrow
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    // Schedule the trigger (daily)
    await notifee.createTriggerNotification(
      {
        id: task.id,
        title: 'Routine Reminder',
        body: `It's time for: ${task.title}`,
        android: {
          channelId,
          smallIcon: 'ic_launcher', // Default icon for now
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      }
    );
  }
}
