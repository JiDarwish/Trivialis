export type ApiResponse<T = null> = {
  status: 'success' | 'error';
  message: string;
  data?: T;
};

export const apiResponses = {
  success: <T>(message: string, data: T): ApiResponse<T> => ({
    status: "success",
    message,
    data,
  }),
  error: <T>(message: string, data = undefined): ApiResponse<T> => ({
    status: "error",
    message,
    data,
  }),
};
