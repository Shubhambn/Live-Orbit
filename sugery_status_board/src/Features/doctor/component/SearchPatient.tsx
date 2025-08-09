'use client';

import { useState, useEffect } from 'react';
import { usePatientStore } from '@/store/patientStore';
import { statusColors } from "@/utils/statusColors";

export default function SearchPatient() {
  const [inputId, setInputId] = useState('');
  const findPatientByPatientNumber = usePatientStore(
    (s) => s.findPatientByPatientNumber
  );
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const clearSelectedPatient = usePatientStore((s) => s.clearSelectedPatient);
  const fetchPatients = usePatientStore((s) => s.fetchPatients);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = async () => {
    const trimmedId = inputId.trim();
    if (trimmedId.length === 6) {
      await findPatientByPatientNumber(trimmedId);
    } else {
      alert('Please enter a valid 6-character Patient ID.');
    }
  };

  const handleClear = () => {
    setInputId('');
    clearSelectedPatient();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Find Patient</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter the patient number to look up current information and update status
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {selectedPatient && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Patient Information</h3>
          <p className="text-sm text-gray-700"><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
          <p className="text-sm text-gray-700"><strong>Patient ID:</strong> {selectedPatient.patientNumber}</p>
          <p className="text-sm text-gray-700"><strong>Address:</strong> {selectedPatient.streetAddress}, {selectedPatient.city}, {selectedPatient.state}, {selectedPatient.country}</p>
          <p className="text-sm text-gray-700"><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
          <p className="text-sm text-gray-700"><strong>Email:</strong> {selectedPatient.contactEmail}</p>
          <p className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[selectedPatient.status]}`}>
            <strong>Current Status:</strong> {selectedPatient.status}
          </p>
        </div>
      )}
    </div>
  );
}