export interface TmdbSeriesGenresResponse {
    genres: Genre[];
}

export interface Genre {
    id: number;
    name: string;
}
