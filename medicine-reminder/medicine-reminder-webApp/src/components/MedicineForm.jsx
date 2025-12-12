import { useState } from 'react';
import useMedicineStore from '../store/useMedicineStore';
import useMessageStore from '../store/useMessageStore';

function MedicineForm() {
  const [name, setName] = useState('');
  const [times, setTimes] = useState(''); // comma separated times
  const [posology, setPosology] = useState('');

  const addMedicine = useMedicineStore((state) => state.addMedicine);
  const setMessage = useMessageStore((state) => state.setMessage);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !times || !posology) {
      setMessage('Please fill all fields', 'error');
      return;
    }

    const timeArray = times.split(',').map((t) => t.trim());
    addMedicine({ id: Date.now(), name, times: timeArray, posology });
    setMessage(`Medicine ${name} added!`, 'success');

    setName('');
    setTimes('');
    setPosology('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md p-4 bg-gray-100 rounded mb-4">
      <input
        type="text"
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Times (comma separated, e.g., 07:00,12:00,18:00)"
        value={times}
        onChange={(e) => setTimes(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Posology (e.g., 2 tablets after meal)"
        value={posology}
        onChange={(e) => setPosology(e.target.value)}
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
}

export default MedicineForm;
