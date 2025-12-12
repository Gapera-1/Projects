import { create } from 'zustand';

const useMedicineStore = create((set, get) => ({
  // Load medicines from localStorage or start with empty array
  medicines: JSON.parse(localStorage.getItem('medicines')) || [],

  addMedicine: (medicine) => {
    set((state) => {
      const newMeds = [
        ...state.medicines,
        { ...medicine, lastNotified: {}, takenTimes: {} },
      ];
      localStorage.setItem('medicines', JSON.stringify(newMeds));
      return { medicines: newMeds };
    });
  },

  removeMedicine: (id) => {
    set((state) => {
      const newMeds = state.medicines.filter((m) => m.id !== id);
      localStorage.setItem('medicines', JSON.stringify(newMeds));
      return { medicines: newMeds };
    });
  },

  markTaken: (id, time) => {
    set((state) => {
      const newMeds = state.medicines.map((m) =>
        m.id === id
          ? { ...m, takenTimes: { ...m.takenTimes, [time]: true } }
          : m
      );
      localStorage.setItem('medicines', JSON.stringify(newMeds));
      return { medicines: newMeds };
    });

    // Stop any ongoing speech immediately
    window.speechSynthesis.cancel();
  },
}));

export default useMedicineStore;
