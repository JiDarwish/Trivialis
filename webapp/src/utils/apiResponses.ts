type ApiResponse = {
  status: number;
  message: string;
  data?: any;
};

export const apiResponses = {
  success: (data: any): ApiResponse => ({
    status: 200,
    message: "Success",
    data,
  }),
  error: (message: string, status: number = 500): ApiResponse => ({
    status,
    message,
  }),
};

