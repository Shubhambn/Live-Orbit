'use client';

import { useState } from 'react';
import { usePatientStore } from '@/Features/doctor/types/patientStore';

export default function SearchPatient() {
  const [inputId, setInputId] = useState('');
  const findPatientById = usePatientStore((s) => s.findPatientById);
  const clearSelectedPatient = usePatientStore((s) => s.clearSelectedPatient);

  const handleSearch = () => {
    const trimmedId = inputId.trim();
    if (trimmedId.length === 6) {
      findPatientById(trimmedId);
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
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
    </div>
  );
}
