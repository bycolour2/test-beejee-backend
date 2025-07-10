type PaginatedResponse<T> = {
  data: T;
  page: number;
  pageSize: number;
  count: number;
};
export default PaginatedResponse;
