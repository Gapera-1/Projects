import { useState } from 'react';
import useMedicineStore from '../store/useMedicineStore';
import useMessageStore from '../store/useMessageStore';
import useAuthStore from '../store/useAuthStore';

function MedicineForm() {
  const [name, setName] = useState('');
  const [times, setTimes] = useState(''); // comma separated times
  const [posology, setPosology] = useState('');

  const addMedicine = useMedicineStore((state) => state.addMedicine);
  const setMessage = useMessageStore((state) => state.setMessage);
  const access = useAuthStore((s) => s.access);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !times || !posology) {
      setMessage('Please fill all fields', 'error');
      return;
    }

    const timeArray = times.split(',').map((t) => t.trim());

    try {
      if (access) {
        // send to backend
        const body = { name, dosage: posology, notes: JSON.stringify({ times: timeArray }) };
        const response = await fetch('http://127.0.0.1:8000/api/medicines/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to add medicine');
        }

        const data = await response.json();

        // normalize to frontend shape
        addMedicine({
          id: data.id,
          name: data.name,
          times: JSON.parse(data.notes || '{}').times || timeArray,
          posology: data.dosage,
          takenTimes: {},
        });
      } else {
        addMedicine({ id: Date.now(), name, times: timeArray, posology });
      }

      setMessage(`Medicine ${name} added!`, 'success');

      setName('');
      setTimes('');
      setPosology('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to add medicine', 'error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 mb-6 border border-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a new medicine</h2>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Medicine name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Times e.g. 07:00,12:00,18:00"
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
        />
      </div>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Posology e.g. 2 tablets after meal"
          value={posology}
          onChange={(e) => setPosology(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
        />
        <button
          type="submit"
          className="mt-1 md:mt-0 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          Add medicine
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Separate times with commas. Example: <span className="font-mono">07:00, 12:00, 18:00</span>
      </p>
    </form>
  );
}

export default MedicineForm;
