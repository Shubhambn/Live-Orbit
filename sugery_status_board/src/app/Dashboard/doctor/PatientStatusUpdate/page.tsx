'use client';

import { useEffect } from 'react';
import { usePatientStore } from '@/app/data/patientStore';
import patients from '@/app/data/PatientsData.json';

import SearchPatient from '@/Features/doctor/dashboard/component/SearchPatient';
import PatientInfo from '@/Features/doctor/dashboard/component/PatientInfo';
import StatusUpdateForm from '@/Features/doctor/dashboard/component/StatusUpdate';
import StatusWorkflow from '@/Features/doctor/dashboard/component/StatusWorkflo';

export default function PatientStatusUpdatePage() {
  const { selectedPatient, setPatients } = usePatientStore();

  useEffect(() => {
    setPatients(patients);
  }, [setPatients]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900 flex justify-center items-center gap-2">
          <span role="img" aria-label="refresh">🔄</span>
          <span>Patient Status Update</span>
        </h1>

        {/* Search Input */}
        <SearchPatient />

        {/* Conditional Display */}
        {selectedPatient?.id ? (
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-6 transition-all duration-200">
            <PatientInfo />
            <hr className="border-gray-200" />
            <StatusUpdateForm />
          </section>
        ) : (
          <StatusWorkflow />
        )}
      </div>
    </main>
  );
}
