export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  privacyPolicy: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface ContactRequest extends ContactFormData {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

// Расширяем Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
