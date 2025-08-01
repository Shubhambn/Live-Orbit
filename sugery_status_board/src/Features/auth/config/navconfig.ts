export const navConfig = {
  visitor: [
    { label: "Home", path: "/" },
    { label: "Status Board", path: "/statusboard" },
  ],
  admin: [
    { label: "Home", path: "/" },
    { label: "Patient Information", path: "/admin/patients" },
    { label: "Status Update", path: "/Dashboard/doctor/PatientStatusUpdate" },
    { label: "Status Board", path: "/surgeon/statusboard" },
  ],
  surgeon: [
    { label: "Home", path: "/" },
    { label: "Status Board", path: "/surgeon/statusboard" },
    { label: "Status Update", path: "Dashboard/doctor/PatientStatusUpdate" },
  ],
};
