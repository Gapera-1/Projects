import { useEffect, useState } from 'react';
import useMessageStore from '../store/useMessageStore';

function Snackbar() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const unsubscribe = useMessageStore.subscribe(
      ({ message, messageType }) => {
        setMessage(message);
        setMessageType(messageType);
        const timer = setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
        return () => clearTimeout(timer);
      },
      (state) => [state.message, state.messageType]
    );

    return () => unsubscribe();
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 rounded-full shadow-lg text-sm font-medium text-white
        transform transition-all duration-300 ease-out
        ${messageType === 'success' ? 'bg-green-600/95' : 'bg-red-600/95'}`}
    >
      <p>{message}</p>
    </div>
  );
}

export default Snackbar;
