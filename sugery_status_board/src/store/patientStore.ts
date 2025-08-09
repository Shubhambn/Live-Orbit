import { create } from "zustand";

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
  status: Status;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  fetchPatients: () => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (
    patient: Omit<Patient, "id" | "patientNumber" | "status">
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  updatePatientStatus: (
    patientNumber: string,
    newStatus: Status
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  findPatientByPatientNumber: (patientNumber: string) => Promise<void>;
  clearSelectedPatient: () => void;
}

const generatePatientNumber = (): string => {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  return Array(6)
    .fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
};

export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: [],
  selectedPatient: null,
  fetchPatients: async () => {
    const response = await fetch("/api/patients");
    const patients = await response.json();
    set({ patients });
  },
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  findPatientByPatientNumber: async (patientNumber) => {
    const { patients } = get();
    const patient = patients.find(
      (p) => p.patientNumber.toLowerCase() === patientNumber.toLowerCase()
    );
    set({ selectedPatient: patient || null });
  },
  clearSelectedPatient: () => set({ selectedPatient: null }),
  addPatient: async (patient) => {
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

    const newPatient = {
      ...patient,
      id: new Date().toISOString(),
      patientNumber: generatePatientNumber(),
      status: "Checked In" as Status,
    };

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatient),
    });

    if (response.ok) {
      set({ patients: [...patients, newPatient] });
      return {
        success: true,
        message: `Successfully added patient ${newPatient.patientNumber}!`,
      };
    } else {
      return {
        success: false,
        message: "Failed to add patient.",
      };
    }
  },
  updatePatientStatus: async (patientNumber, newStatus) => {
    const { patients, selectedPatient } = get();
    const patientIndex = patients.findIndex(
      (p) => p.patientNumber === patientNumber
    );

    if (patientIndex === -1) {
      return { success: false, message: "Patient not found." };
    }

    const patient = patients[patientIndex];
    const updatedPatient = { ...patient, status: newStatus };

    const response = await fetch(`/api/patients/${patient.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPatient),
    });

    if (response.ok) {
      const updatedPatients = [...patients];
      updatedPatients[patientIndex] = updatedPatient;

      const updatedSelectedPatient =
        selectedPatient?.patientNumber === patientNumber
          ? updatedPatient
          : selectedPatient;

      set({
        patients: updatedPatients,
        selectedPatient: updatedSelectedPatient,
      });
      return { success: true, message: "Patient status updated." };
    } else {
      return { success: false, message: "Failed to update patient status." };
    }
  },
}));
