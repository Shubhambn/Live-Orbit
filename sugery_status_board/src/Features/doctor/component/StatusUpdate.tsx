"use client";

import { useEffect, useState } from "react";
import { Status, IPatients } from "@/types/patientStore";

const workflowSteps: Status[] = [
  "Checked In",
  "Pre-Procedure",
  "In Progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
];

export default function StatusUpdateForm({ patientNumber }: { patientNumber: string }) {
  const [patient, setPatient] = useState<IPatients | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients/${patientNumber}`);
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data: IPatients = await res.json();
        if (mounted) setPatient(data);
      } catch (err) {
        console.error(err);
        if (mounted) setPatient(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPatient();
    return () => {
      mounted = false;
    };
  }, [patientNumber]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!patient) return;

    const newStatus = e.target.value as Status;
    if (newStatus === patient.status) return;

    const currentIndex = workflowSteps.indexOf(patient.status);
    const newIndex = workflowSteps.indexOf(newStatus);
    if (newIndex > currentIndex + 1) {
      const skipCount = newIndex - currentIndex - 1;
      const proceed = window.confirm(
        `You're moving from "${patient.status}" to "${newStatus}" skipping ${skipCount} step${skipCount > 1 ? "s" : ""}. Do you want to continue?`
      );
      if (!proceed) {
        return;
      }
    }


    setUpdating(true);
    try {
      const res = await fetch(`/api/patients/${patientNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = (errBody && (errBody.error || errBody.message)) || res.statusText;
        alert(`Error updating status: ${msg}`);
        return;
      }

      const updatedPatient: IPatients = await res.json();
      setPatient(updatedPatient);
    } catch (error) {
      console.error("Failed to update patient status", error);
      alert("Failed to update patient status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading patient data...</div>;
  if (!patient) return <div>Patient not found.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Update Surgery Status</h2>

      <label htmlFor="status" className="text-sm text-gray-600">
        Select new status
      </label>

      <select
        id="status"
        value={patient.status}
        onChange={handleChange}
        disabled={updating}
        className="w-full text-sm border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        <option value="">Choose a status...</option>
        {workflowSteps.map((step) => (
          <option key={step} value={step}>
            {step}
          </option>
        ))}
      </select>

      {updating && <p className="text-sm text-gray-500">Updating status…</p>}
    </div>
  );
}
