import { useEffect } from 'react';
import useMedicineStore from './store/useMedicineStore';
import useMessageStore from './store/useMessageStore';

function ReminderChecker() {
  const medicines = useMedicineStore((state) => state.medicines);
  const setMessage = useMessageStore((state) => state.setMessage);

  useEffect(() => {
    // Request permission for desktop notifications
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const today = now.toDateString();

      medicines.forEach((med) => {
        if (!med.takenTimes) med.takenTimes = {};
        if (!med.lastNotified) med.lastNotified = {};

        med.times.forEach((time) => {
          const [h, m] = time.split(':').map(Number);
          const medMinutes = h * 60 + m;

          // Skip if medicine is already marked as taken for this time
          if (med.takenTimes[time]) return;

          // Trigger reminder if current time >= scheduled time
          if (currentMinutes >= medMinutes) {
            const messageText = `Please take ${med.posology} of ${med.name}`;

            // Show in-app Snackbar
            setMessage(messageText, 'success');

            // Speak reminder if not already speaking
            if ('speechSynthesis' in window && !med.speaking) {
              const utterance = new SpeechSynthesisUtterance(messageText);
              utterance.rate = 1;
              utterance.pitch = 1;

              med.speaking = true; // flag to prevent overlapping speech
              utterance.onend = () => {
                med.speaking = false; // allow speech again next interval
              };

              window.speechSynthesis.speak(utterance);
            }

            // Desktop notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Medicine Reminder', { body: messageText });
            }

            // Keep track of last notified time (optional)
            med.lastNotified[time] = today;
          }
        });
      });
    }, 10000); // check every 10 seconds for repeated reminders

    return () => clearInterval(interval);
  }, [medicines, setMessage]);

  return null;
}

export default ReminderChecker;
