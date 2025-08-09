"use client";

import { usePatientStore, Status } from "@/store/patientStore";

const workflowSteps = [
  "Checked In",
  "Pre-Procedure",
  "In Progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
];

export default function StatusUpdateForm() {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const updatePatientStatus = usePatientStore((s) => s.updatePatientStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (!selectedPatient || newStatus === selectedPatient.status) return;

    // Safety check: ensure newStatus is a valid Status
    if (!workflowSteps.includes(newStatus)) return;

    const newStatusTyped = newStatus as Status;

    const currentIndex = workflowSteps.indexOf(selectedPatient.status);
    const newIndex = workflowSteps.indexOf(newStatusTyped);

    if (currentIndex === newIndex) return;

    if (newIndex < currentIndex && newIndex !== currentIndex - 1) {
      alert("You cannot move status back more than one step.");
      return;
    }

    if (newIndex > currentIndex + 1) {
      const confirmSkip = window.confirm(
        `You're about to skip ${
          newIndex - currentIndex
        } steps ahead. Are you sure?`
      );
      if (!confirmSkip) return;
    }

    await updatePatientStatus(selectedPatient.patientNumber, newStatusTyped);
  };

  if (!selectedPatient) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Update Surgery Status
      </h2>
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
