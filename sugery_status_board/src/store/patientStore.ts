import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the Patient interface
export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "patientNumber">) => {
    success: boolean;
    message: string;
  };
}

const generatePatientNumber = (): string => {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  return Array(6)
    .fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      addPatient: (patient) => {
        const { patients } = get();
        const emailExists = patients.some(
          (p) =>
            p.contactEmail.toLowerCase() === patient.contactEmail.toLowerCase()
        );

        if (emailExists) {
          return {
            success: false,
            message: "A patient with this email already exists.",
          };
        }

        // Generate the random patient number
        const patientNumber = generatePatientNumber();
        const newPatient: Patient = {
          ...patient,
          id: `patient-${Date.now()}`,
          patientNumber,
        };

        set({ patients: [...patients, newPatient] });
        return {
          success: true,
          message: `Successfully added patient ${patientNumber}!`,
        };
      },
    }),
    {
      name: "patient-storage", // unique name for localStorage
    }
  )
);
