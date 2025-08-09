import { usePatientStore } from "@/store/patientStore";
import { statusColors } from "@/utils/statusColors";

export default function ActivePatientCard() {
  const patients = usePatientStore((state) => state.patients);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {patients.map((patient) => (
        <article
          key={patient.patientNumber}
          className="border-l-4 border-accentMain p-4 flex flex-col justify-center items-center rounded-2xl shadow-md bg-white"
        >
          <p className="font-semibold text-lg sm:text-xl text-center">
            {patient.patientNumber}
          </p>
          <p className="text-gray-600 text-sm sm:text-base text-center">
            {patient.lastName} {patient.firstName}
          </p>
          <div
            className={`mt-2 rounded-xl px-3 py-1 text-xs sm:text-sm ${statusColors[patient.status]}`}>
            {patient.status}
          </div>
        </article>
      ))}
    </div>
  );
}
