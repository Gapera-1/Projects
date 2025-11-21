import React from 'react';
import MedicineForm from './components/MedicineForm';
import MedicineList from './components/MedicineList';
import Snackbar from './components/Snackbar';
import ReminderChecker from './ReminderChecker';

function App() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Medicine Reminder</h1>
      <MedicineForm />
      <MedicineList />
      <Snackbar />
      <ReminderChecker />
    </div>
  );
}

export default App;
