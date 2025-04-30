export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
