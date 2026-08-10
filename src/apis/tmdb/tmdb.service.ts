import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { TmdbMovieListResponse, TmdbSeriesGenresResponse, TmdbMovieGenresResponse, TmdbSeriesListResponse } from './interfaces';
import { TmdbMovieMapper } from './mappers/tmdb-movie.mapper';
import { TmdbSeriesMapper } from './mappers/tmdb-series.mapper';
import { TmdbGenresMapper } from './mappers/tmdb-genres.mapper';
import { TmdbMovieDetailsResponse, TmdbMovieResponse } from './interfaces/tmdb-movie-response';
import { TmdbSeriesDetailsResponse, TmdbSeriesResponse } from './interfaces/tmdb-series-response';

@Injectable()
export class TmdbService {
    //TODO! Move baseURL to env file
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    private readonly apiKey = process.env.TMDB_API_KEY;
    private readonly headers = {
        Authorization: `Bearer ${this.apiKey}`,
        accept: 'application/json',
    };


    constructor(

        private readonly http: AxiosAdapter,

    ) { }


    async getMovie(tmdbId: number) {

        return TmdbMovieMapper.toMovie(await this.http.get<TmdbMovieResponse>(`${this.baseUrl}/movie/${tmdbId}?api_key=${this.apiKey}`, { headers: this.headers }));
    }

    async getPopularMovies(page: number) {
        const url = `${this.baseUrl}/movie/popular?page=${page}`;
        return TmdbMovieMapper.toMovieList(await this.http.get<TmdbMovieListResponse>(url, { headers: this.headers }));
    }

    async searchMovies(query: string) {
        return await this.http.get<any>(`${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`, { headers: this.headers });
    }

    async getMovieGenres() {

        return TmdbGenresMapper.toMovieGenre(await this.http.get<TmdbMovieGenresResponse>(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`, { headers: this.headers }));

    }

    async getSeriesGenres() {
        return TmdbGenresMapper.toSeriesGenre(await this.http.get<TmdbSeriesGenresResponse>(`${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}`, { headers: this.headers }));
    }

    async getMovieWithCredits(tmdbId: number) {
        const url = `${this.baseUrl}/movie/${tmdbId}?append_to_response=credits`;
        const data = await this.http.get<TmdbMovieDetailsResponse>(url, { headers: this.headers });
        return TmdbMovieMapper.toMovieWithCredits(data);
    }

    async getSeriesCast(tmdbId: number) {
        return await this.http.get<any>(`${this.baseUrl}/tv/${tmdbId}/credits?api_key=${this.apiKey}`, { headers: this.headers });
    }

    async getSeries(tmdbId: number) {
        return TmdbSeriesMapper.toSeries(await this.http.get<TmdbSeriesResponse>(`${this.baseUrl}/tv/${tmdbId}?api_key=${this.apiKey}`, { headers: this.headers }));
    }

    async getPopularSeries(page: number) {
        const url = `${this.baseUrl}/tv/popular?page=${page}`;
        return TmdbSeriesMapper.toSeriesList(await this.http.get<TmdbSeriesListResponse>(url, { headers: this.headers }));
    }

    async searchSeries(query: string) {
        return await this.http.get<any>(`${this.baseUrl}/search/tv?query=${encodeURIComponent(query)}`, { headers: this.headers });
    }

    async getSeriesWithCredits(tmdbId: number) {
        const url = `${this.baseUrl}/tv/${tmdbId}?append_to_response=credits`;
        const data = await this.http.get<TmdbSeriesDetailsResponse>(url, { headers: this.headers });
        return TmdbSeriesMapper.toSeriesWithCredits(data);
    }
}
