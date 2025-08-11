import { create } from "zustand";

import { Status,IPatients } from "@/types/patientStore";


interface PatientState {
  patients: IPatients[];
  selectedPatient: IPatients| null;
  fetchPatients: () => Promise<void>;
  setPatients: (patients: IPatients[]) => void;
  setSelectedPatient: (patient: IPatients | null) => void;
  addPatient: (patient: Omit<IPatients, "_id" | "patientNumber" | "status">) => Promise<{ success: boolean; message: string }>;
  updatePatientStatus: (patientNumber: string, newStatus: Status) => Promise<{ success: boolean; message: string }>;
  findPatientByPatientNumber: (patientNumber: string) => Promise<void>;
  clearSelectedPatient: () => void;
}


export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: [],
  selectedPatient: null,

  fetchPatients: async () => {
    try {
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const patients = await response.json();
      set({ patients });
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  },

  setPatients: (patients) => set({ patients }),

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),

  findPatientByPatientNumber: async (patientNumber) => {
    try {
      const response = await fetch(`/api/patients/by-number/${patientNumber}`);
      if (!response.ok) throw new Error("Patient not found");
      const patient = await response.json();
      set({ selectedPatient: patient });
    } catch {
      set({ selectedPatient: null });
    }
  },

  clearSelectedPatient: () => set({ selectedPatient: null }),

  addPatient: async (patient) => {
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });

      const result = await response.json();

      if (response.ok) {
        set({ patients: [...get().patients, result] });
        return { success: true, message: `Successfully added patient ${result.patientNumber}!` };
      } else {
        return { success: false, message: result.message || "Failed to add patient." };
      }
    } catch{
      return { success: false, message: "Error adding patient." };
    }
  },

  updatePatientStatus: async (patientNumber, newStatus) => {
    try {
      const response = await fetch(`/api/patients/${patientNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        const updatedPatients = get().patients.map((p) =>
          p.patientNumber === patientNumber ? { ...p, status: newStatus } : p
        );

        set({
          patients: updatedPatients,
          selectedPatient:
            get().selectedPatient?.patientNumber === patientNumber
              ? { ...get().selectedPatient!, status: newStatus }
              : get().selectedPatient,
        });

        return { success: true, message: "Patient status updated." };
      } else {
        return { success: false, message: result.message || "Failed to update patient status." };
      }
    } catch{
      return { success: false, message: "Error updating patient status." };
    }
  },
}));
