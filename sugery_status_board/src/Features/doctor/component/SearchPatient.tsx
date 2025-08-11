"use client";

import { useState } from "react";
import { IPatients } from "@/types/patientStore";
import PatientDetailsCard from "./PatientInfo";
import StatusUpdateForm from "./StatusUpdate";

export default function SearchPatient() {
  const [inputId, setInputId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<IPatients | null>(null);

  const handleSearch = async () => {
    const trimmedId = inputId.trim();
    if (trimmedId.length === 6) {
      try {
        const res = await fetch(`/api/patients/${trimmedId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          alert("Patient not found");
          return;
        }

        const data: IPatients = await res.json();
        setSelectedPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    } else {
      alert("Please enter a valid 6-character Patient ID.");
    }
  };

  const handleClear = () => {
    setInputId("");
    setSelectedPatient(null);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Find Patient</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter the patient number to look up current information
      </p>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter 6-character Patient ID"
          className="w-full sm:w-auto flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium bg-accentMain text-white rounded-lg hover:bg-accentSub transition"
          >
            Look Up
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Patient Details + Status Update */}
      {selectedPatient && (
        <div className="mt-6 space-y-6">
          <PatientDetailsCard patientNumber={selectedPatient.patientNumber} /> 
          <StatusUpdateForm patientNumber={selectedPatient.patientNumber} />
        </div>
      )}
    </div>
  );
}
