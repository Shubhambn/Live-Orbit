'use client';

import { usePatientStore } from '@/app/data/patientStore';
import { MapPin, Phone, Mail, User } from 'lucide-react';

const statusStyles: Record<string, string> = {
  'Checked In': 'bg-blue-500 text-white',
  'Pre-Procedure': 'bg-yellow-500 text-white',
  'In Progress':'bg-orange-500 text white',
  'Closing':'bg-violet-500 text white',
  'Recovery':'bg-sky-500 text white',
  'Complete':'bg-green-500 text white',
  'Dismissal': 'bg-gray-500 text-white',
};

const statusDescriptions: Record<string, string> = {
  'Checked In': 'In the facility awaiting their procedure',
  'Pre-Procedure': 'Undergoing surgical preparation',
  'In Progress':'Surgical produre is underway',
  'Closing':'Surgery completed',
  'Recovery':'Patient transferred to post-surgery recovery room',
  'Complete':'Recovery completed Patient awaiting dismissal',
  'Dismissal': 'Tranderred to hospital room or patient has left',
}

export default function PatientDetailsCard() {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);

  if (!selectedPatient) return null;

  const badgeClass =
    statusStyles[selectedPatient.status] || 'bg-slate-400 text-white';

  const description =
    statusDescriptions[selectedPatient.status] || 'Status unknown';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Name:</span> {selectedPatient.name}
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Email:</span> {selectedPatient.email}
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Phone:</span> {selectedPatient.phone}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Address:</span> {selectedPatient.address}
        </div>
      </div>

      {/* Current Status Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 font-medium">Current Status</p>

        <div className="flex items-center gap-3 mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${badgeClass}`}>
            {selectedPatient.status}
          </span>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
