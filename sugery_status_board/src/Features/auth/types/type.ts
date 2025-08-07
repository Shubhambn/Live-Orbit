type Role = "visitor" | "admin" | "surgeon";
export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: {
    firstname: string;
    lastname: string;
  };
}

export interface AuthStore {
  role: Role;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
