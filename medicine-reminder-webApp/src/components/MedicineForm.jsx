import { useState } from 'react';
import useMedicineStore from '../store/useMedicineStore';
import useMessageStore from '../store/useMessageStore';
import useAuthStore from '../store/useAuthStore';

function MedicineForm() {
  const [name, setName] = useState('');
  const [times, setTimes] = useState('');
  const [posology, setPosology] = useState('');
  const [duration, setDuration] = useState('');

  const addMedicine = useMedicineStore((state) => state.addMedicine);
  const setMessage = useMessageStore((state) => state.setMessage);
  const access = useAuthStore((s) => s.access);

  const validateTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !times || !posology || !duration) {
      setMessage('Please fill all fields', 'error');
      return;
    }

    const timeArray = times.split(',').map((t) => t.trim());

    for (let t of timeArray) {
      if (!validateTime(t)) {
        setMessage(`Invalid time format: ${t}. Use HH:MM (24-hour).`, 'error');
        return;
      }
    }

    try {
      if (access) {
        const body = {
          name,
          dosage: posology,
          notes: JSON.stringify({ times: timeArray }),
          duration: Number(duration),
        };

        const response = await fetch('http://127.0.0.1:8000/api/medicines/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error('Failed to add medicine');

        const data = await response.json();

        addMedicine({
          id: data.id,
          name: data.name,
          posology: data.dosage,
          times: JSON.parse(data.notes || '{}').times || timeArray,
          duration: data.duration,
          takenTimes: {},
        });
      } else {
        addMedicine({
          id: Date.now(),
          name,
          posology,
          times: timeArray,
          duration: Number(duration),
        });
      }

      setMessage(`Medicine ${name} added!`, 'success');

      setName('');
      setTimes('');
      setPosology('');
      setDuration('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to add medicine', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md p-4 bg-gray-100 rounded mb-4">
      <input
        type="text"
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Times (comma separated, e.g., 07:00,12:00,18:00)"
        value={times}
        onChange={(e) => setTimes(e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Posology (e.g., 2 tablets after meal)"
        value={posology}
        onChange={(e) => setPosology(e.target.value)}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2"
        min="1"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
}

export default MedicineForm;
