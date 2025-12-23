import { create } from 'zustand';
import useAuthStore from './useAuthStore';

const useMedicineStore = create((set, get) => ({
  medicines: [],

  setMedicines: (meds) => {
    set({ medicines: meds });
    localStorage.setItem('medicines', JSON.stringify(meds));
  },

  fetchMedicines: async () => {
    const { access } = useAuthStore.getState();
    if (!access) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/medicines/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      const mapped = data.map((d) => ({
        id: d.id,
        name: d.name,
        posology: d.dosage,
        times: d.notes ? JSON.parse(d.notes).times || [] : [],
        takenTimes: {},
      }));
      get().setMedicines(mapped);
    } catch (err) {
      console.error('Failed to fetch medicines', err);
    }
  },

  addMedicine: async (medicine) => {
    const { access } = useAuthStore.getState();
    if (!access) {
      // local only
      set((state) => {
        const newMeds = [...state.medicines, { ...medicine, id: Date.now(), takenTimes: {} }];
        localStorage.setItem('medicines', JSON.stringify(newMeds));
        return { medicines: newMeds };
      });
      return;
    }

    try {
      const body = { name: medicine.name, dosage: medicine.posology, notes: JSON.stringify({ times: medicine.times }) };
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
      get().setMedicines([...get().medicines, {
        id: data.id,
        name: data.name,
        posology: data.dosage,
        times: JSON.parse(data.notes || '{}').times || [],
        takenTimes: {},
      }]);
    } catch (err) {
      console.error(err);
    }
  },

  removeMedicine: async (id) => {
    const { access } = useAuthStore.getState();
    if (!access) {
      set((state) => {
        const newMeds = state.medicines.filter((m) => m.id !== id);
        localStorage.setItem('medicines', JSON.stringify(newMeds));
        return { medicines: newMeds };
      });
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/medicines/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${access}` },
      });
      if (response.ok) {
        set((state) => ({ medicines: state.medicines.filter((m) => m.id !== id) }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  markTaken: (id, time) => {
    set((state) => {
      const newMeds = state.medicines.map((m) =>
        m.id === id ? { ...m, takenTimes: { ...m.takenTimes, [time]: true } } : m
      );
      localStorage.setItem('medicines', JSON.stringify(newMeds));
      return { medicines: newMeds };
    });
    window.speechSynthesis.cancel();
  },
}));

export default useMedicineStore;
