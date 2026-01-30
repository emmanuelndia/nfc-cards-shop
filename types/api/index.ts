export * from "./interface/auth";

// Types généraux pour toutes les API
export interface ApiResponse<T = any> {
  status?: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}