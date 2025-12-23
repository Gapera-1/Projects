import { useEffect } from 'react';
import useMedicineStore from './store/useMedicineStore';
import useMessageStore from './store/useMessageStore';

function ReminderChecker() {
  const medicines = useMedicineStore((state) => state.medicines);
  const removeMedicine = useMedicineStore((state) => state.removeMedicine);
  const setMessage = useMessageStore((state) => state.setMessage);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();

      medicines.forEach((med) => {
        if (!med.takenTimes) med.takenTimes = {};

        // Stop reminders if treatment duration ended
        if (med.duration && med.startDate) {
          const start = new Date(med.startDate);
          const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
          if (daysPassed >= med.duration) {
            removeMedicine(med.id);
            return;
          }
        }

        med.times.forEach((time) => {
          const [hours, minutes] = time.split(':').map(Number);

          // Create a scheduled Date object for today
          let scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);

          // If scheduled time already passed today, schedule it for tomorrow
          if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }

          // Skip if taken
          if (med.takenTimes[time]) return;

          // Trigger reminder only if current time >= scheduledTime
          if (now >= scheduledTime) {
            const messageText = `Please take ${med.posology} of ${med.name}`;

            // In-app snackbar
            setMessage(messageText, 'success');

            // Speech
            if ('speechSynthesis' in window && !med.speaking) {
              const utterance = new SpeechSynthesisUtterance(messageText);
              utterance.rate = 1;
              utterance.pitch = 1;
              med.speaking = true;
              utterance.onend = () => (med.speaking = false);
              window.speechSynthesis.speak(utterance);
            }

            // Desktop notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Medicine Reminder', { body: messageText });
            }
          }
        });
      });
    }, 10000); // repeat every 10 seconds

    return () => clearInterval(interval);
  }, [medicines, setMessage, removeMedicine]);

  return null;
}

export default ReminderChecker;
