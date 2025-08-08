export const navConfig = {
  visitor: [
    { label: "Home", path: "/" },
    { label: "Status Board", path: "/Dashboard/statusboard" },
  ],
  admin: [
    { label: "Home", path: "/" },
    { label: "Patient Information", path: "/Dashboard/admin" },
    { label: "Status Update", path: "/Dashboard/doctor/PatientStatusUpdate" },
    { label: "Status Board", path: "/Dashboard/statusboard" },
  ],
  surgeon: [
    { label: "Home", path: "/" },
    { label: "Status Board", path: "/Dashboard/statusboard" },
    { label: "Status Update", path: "/Dashboard/doctor/PatientStatusUpdate" },
  ],
};
