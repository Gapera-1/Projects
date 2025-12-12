import useMedicineStore from '../store/useMedicineStore';

function MedicineList() {
  const medicines = useMedicineStore((state) => state.medicines);
  const removeMedicine = useMedicineStore((state) => state.removeMedicine);
  const markTaken = useMedicineStore((state) => state.markTaken);

  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded ">
      <h2 className="font-bold mb-2">Medicine List</h2>
      <ul>
        {medicines.map((med) => (
          <li key={med.id} className="mb-4">
            <div className="mb-1 font-semibold">
              {med.name} — {med.posology}
            </div>
            <div className="flex gap-2 flex-wrap">
              {med.times.map((time) => (
                <div key={time} className="flex flex-row items-center gap-2">
                  <span>{time}</span>
                  {med.takenTimes?.[time] ? (
                    <span className="text-green-600 font-bold">Taken ✅</span>
                  ) : (
                    <button
                      onClick={() => markTaken(med.id, time)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => removeMedicine(med.id)}
              className="flex flex-row bg-red-600 text-white p-1 rounded mt-2"
            >
              Remove Medicine
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicineList;
