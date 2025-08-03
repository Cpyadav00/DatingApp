export type Pagtination = {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalCount: number;

}

export type PaginatedResult<T>={
items:T[];
metaData:Pagtination;
}