type Role = "visitor" | "admin" | "surgeon";
interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  name: {
    firstname: string;
    lastname: string;
  };
}

interface AuthStore {
  role: Role;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
