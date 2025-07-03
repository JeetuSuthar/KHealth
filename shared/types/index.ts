export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface HealthParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  category: string;
}

export interface LabReport {
  _id: string;
  userId: string;
  filename: string;
  uploadDate: Date;
  parameters: HealthParameter[];
  insights: string[];
  reportType: string;
  
}

export interface TrendData {
  date: string;
  value: number;
  parameter: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}