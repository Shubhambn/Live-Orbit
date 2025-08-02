import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Patient = {
  id: string;
  name: string;
  status: string;
  email: string;
  phone: string;
  address: string;
};

type PatientState = {
  patients: Patient[];
  selectedPatient: Patient | null;
  setPatients: (patients: Patient[]) => void;
  findPatientById: (id: string) => void;
  updatePatientStatus: (id: string, newStatus: string) => void;
  clearSelectedPatient: () => void;
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      selectedPatient: null,

      setPatients: (patients) => set({ patients }),

      findPatientById: (id) => {
        const found = get().patients.find((p) => p.id === id);
        set({ selectedPatient: found || null });
      },

      updatePatientStatus: (id, newStatus) => {
        const { patients } = get();
        const patient = patients.find((p) => p.id === id);
        if (!patient) return;

        const statusOrder = [
  'Checked In',
  'Pre-Procedure',
  'In Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
        ];

        const currentIndex = statusOrder.indexOf(patient.status);
        const newIndex = statusOrder.indexOf(newStatus);

        if (currentIndex === -1 || newIndex === -1) {
          alert('Invalid status value.');
          return;
        }

        const stepDifference = newIndex - currentIndex;

        // Allow backward or one-step forward freely
        if (stepDifference > 1) {
          const confirmSkip = window.confirm(
            `You are trying to skip ${stepDifference} steps. Are you sure you want to proceed?`
          );
          if (!confirmSkip) return;
        }

        const updatedPatients = patients.map((p) =>
          p.id === id ? { ...p, status: newStatus } : p
        );

        const updatedSelected = updatedPatients.find((p) => p.id === id) || null;

        set({
          patients: updatedPatients,
          selectedPatient: updatedSelected,
        });
      },

      clearSelectedPatient: () => set({ selectedPatient: null }),
    }),
{
  name: 'patient-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    patients: state.patients, // ✅ only persist patients
  }),
}

  )
);
