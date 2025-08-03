import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the status workflow
export const statusWorkflow = [
  "Checked In",
  "Pre-Procedure",
  "In Progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
] as const;

export type Status = (typeof statusWorkflow)[number];

// Define the Patient interface
export interface Patient {
  patientNumber: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
  status: Status;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Omit<Patient, "patientNumber" | "status">) => {
    success: boolean;
    message: string;
  };
  updatePatientStatus: (
    patientNumber: string,
    newStatus: Status
  ) => {
    success: boolean;
    message: string;
  };
  findPatientByPatientNumber: (patientNumber: string) => void;
  clearSelectedPatient: () => void;
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
      selectedPatient: null,
      setPatients: (patients) => set({ patients }),
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),
      findPatientByPatientNumber: (patientNumber) => {
        const { patients } = get();
        const patient = patients.find(
          (p) => p.patientNumber.toLowerCase() === patientNumber.toLowerCase()
        );
        set({ selectedPatient: patient || null });
      },
      clearSelectedPatient: () => set({ selectedPatient: null }),
      addPatient: (patient) => {
        const { patients } = get();
        const emailExists = patients.some(
          (p) => p.contactEmail.toLowerCase() === patient.contactEmail.toLowerCase()
        );

        if (emailExists) {
          return {
            success: false,
            message: "A patient with this email already exists.",
          };
        }

        // Generate the random patient number
        const newPatient: Patient = {
          ...patient,
          patientNumber: generatePatientNumber(),
          status: "Checked In", // Default status
        };

        set({ patients: [...patients, newPatient] });
        return {
          success: true,
          message: `Successfully added patient ${newPatient.patientNumber}!`,
        };
      },
      updatePatientStatus: (patientNumber, newStatus) => {
        const { patients } = get();
        const patientIndex = patients.findIndex((p) => p.patientNumber === patientNumber);

        if (patientIndex === -1) {
          return { success: false, message: "Patient not found." };
        }

        const patient = patients[patientIndex];
        const currentStatusIndex = statusWorkflow.indexOf(patient.status);
        const newStatusIndex = statusWorkflow.indexOf(newStatus);

        if (newStatusIndex < 0) {
          return { success: false, message: "Invalid status." };
        }

        // Allow moving one step back or any number of steps forward
        if (
          newStatusIndex < currentStatusIndex &&
          newStatusIndex !== currentStatusIndex - 1
        ) {
          return {
            success: false,
            message: "Cannot move status back more than one step.",
          };
        }

        const updatedPatients = [...patients];
        updatedPatients[patientIndex] = { ...patient, status: newStatus };
        set({ patients: updatedPatients });

        return { success: true, message: "Patient status updated." };
      },
    }),
    {
      name: "patient-storage", // unique name for localStorage
    }
  )
);