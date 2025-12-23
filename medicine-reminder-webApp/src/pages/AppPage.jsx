import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";
import Snackbar from "../components/Snackbar";
import ReminderChecker from "../ReminderChecker";
import useMedicineStore from "../store/useMedicineStore";
import useAuthStore from "../store/useAuthStore";

function AppPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const { access, clearAuth } = useAuthStore();
  const setMedicines = useMedicineStore((s) => s.setMedicines);

  useEffect(() => {
    if (!access) return;

    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/medicines/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        const mapped = data.map((d) => ({
          id: d.id,
          name: d.name,
          posology: d.dosage,
          times: (d.notes && JSON.parse(d.notes).times) || [],
          takenTimes: {},
        }));
        setMedicines(mapped);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
      }
    };

    fetchMedicines();
  }, [access, setMedicines]);

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen p-10 bg-blue-50">
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-1 rounded"
      >
        Log Out
      </button>

      <h1 className="text-2xl font-bold mb-6">Medicine Reminder</h1>

      <div className="flex gap-6 max-w-5xl mx-auto">
        <div className="w-1/2">
          <MedicineForm />
        </div>
        <div className="w-1/2">
          <MedicineList />
        </div>
      </div>

      <Snackbar />
      <ReminderChecker />
    </div>
  );
}

export default AppPage;
