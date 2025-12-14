export interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
}
