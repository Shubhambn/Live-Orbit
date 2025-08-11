"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";
import { statusColors } from "@/utils/statusColors";
import { IPatients } from "@/types/patientStore";

const statusDescriptions: Record<string, string> = {
  "Checked In": "In the facility awaiting their procedure",
  "Pre-Procedure": "Undergoing surgical preparation",
  "In Progress": "Surgical procedure is underway",
  "Closing": "Surgery completed",
  "Recovery": "Patient transferred to post-surgery recovery room",
  "Complete": "Recovery completed, patient awaiting dismissal",
  "Dismissal": "Transferred to hospital room or patient has left",
};

export default function PatientDetailsCard({ patientNumber }: { patientNumber: string }) {
  const [patient, setPatient] = useState<IPatients | null>(null);

  // Fetch when patientNumber changes
  useEffect(() => {
    if (!patientNumber) {
      setPatient(null);
      return;
    }

    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients/${patientNumber}`);
        if (res.ok) {
          const data: IPatients = await res.json();
          setPatient(data);
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };

    fetchPatient(); // Initial load
    const interval = setInterval(fetchPatient, 3000); // Refresh every 3s

    return () => clearInterval(interval); // Cleanup on unmount
  }, [patientNumber]);

  if (!patient) return null;

  const badgeClass = statusColors[patient.status] || "bg-slate-400 text-white";
  const description = statusDescriptions[patient.status] || "Status unknown";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Name:</span> {patient.firstName} {patient.lastName}
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Email:</span> {patient.contactEmail}
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Phone:</span> {patient.phoneNumber}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Address:</span> {patient.streetAddress}, {patient.city}, {patient.state}, {patient.country}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 font-medium">Current Status</p>
        <div className="flex items-center gap-3 mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${badgeClass}`}>
            {patient.status}
          </span>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
