import { useEffect } from 'react';
import useMedicineStore from '../store/useMedicineStore';
import useAuthStore from '../store/useAuthStore';

function MedicineList() {
  const medicines = useMedicineStore((state) => state.medicines);
  const setMedicines = useMedicineStore((state) => state.setMedicines);
  const removeMedicine = useMedicineStore((state) => state.removeMedicine);
  const markTaken = useMedicineStore((state) => state.markTaken);
  const access = useAuthStore((s) => s.access);

  useEffect(() => {
    if (!access) return;

    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/medicines/', {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const mapped = data.map((d) => ({
          id: d.id,
          name: d.name,
          posology: d.dosage,
          times:
            (d.notes &&
              (() => {
                try {
                  return JSON.parse(d.notes).times || [];
                } catch {
                  return [];
                }
              })()) ||
            [],
          takenTimes: {},
        }));
        setMedicines(mapped);
      } catch {
        // ignore network errors for now
      }
    };

    fetchMedicines();
  }, [access, setMedicines]);

  const handleRemove = async (id) => {
    if (!access) {
      removeMedicine(id);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/medicines/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${access}` },
      });

      if (response.ok) {
        removeMedicine(id);
      }
    } catch {
      // ignore for now
    }
  };

  if (!medicines.length) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-5 border border-dashed border-gray-200 text-center text-gray-500 text-sm">
        No medicines added yet. Start by adding one above.
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your medicines</h2>
      <ul className="space-y-4">
        {medicines.map((med) => (
          <li
            key={med.id}
            className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-900">{med.name}</div>
                <div className="text-sm text-gray-600">{med.posology}</div>
              </div>
              <button
                onClick={() => handleRemove(med.id)}
                className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium transition-colors"
              >
                Remove
              </button>
            </div>

            {!!med.times.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {med.times.map((time) => (
                  <div
                    key={time}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    <span className="font-mono">{time}</span>
                    {med.takenTimes?.[time] ? (
                      <span className="text-green-600 text-[11px] font-semibold">Taken ✅</span>
                    ) : (
                      <button
                        onClick={() => markTaken(med.id, time)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Mark as taken
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicineList;
