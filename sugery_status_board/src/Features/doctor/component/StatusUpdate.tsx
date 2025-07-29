'use client';

import { usePatientStore } from '@/app/data/patientStore';

const workflowSteps = [
  'Checked In',
  'Pre-Procedure',
  'In Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

export default function StatusUpdateForm() {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const updatePatientStatus = usePatientStore((s) => s.updatePatientStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!selectedPatient || newStatus === selectedPatient.status) return;

    updatePatientStatus(selectedPatient.id, newStatus);

    try {
      const res = await fetch('/api/UpdatePatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPatient.id, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      console.log('✅ Status updated on server');
    } catch (error) {
      console.error('Server update failed:', error);
      alert('⚠ Could not save to server. Please try again later.');
    }
  };

  if (!selectedPatient) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Update Surgery Status</h2>
      <label htmlFor="status" className="text-sm text-gray-600">
        Select new status
      </label>
      <select
        id="status"
        value={selectedPatient.status}
        onChange={handleChange}
        className="w-full text-sm border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Choose a status...</option>
        {workflowSteps.map((step) => (
          <option key={step} value={step}>
            {step}
          </option>
        ))}
      </select>
    </div>
  );
}
