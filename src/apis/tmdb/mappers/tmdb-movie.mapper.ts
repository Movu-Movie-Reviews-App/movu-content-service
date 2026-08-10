import { Movie } from "src/common/interfaces/movie.interface";
import { CreateContentDto } from "src/content/dto/create-content.dto";
import { TmdbMovieListResponse } from "../interfaces";
import { TmdbMovieDetailsResponse, TmdbMovieResponse } from "../interfaces/tmdb-movie-response";
import { TmdbCreditMapper } from "./tmdb-credit.mapper";

export class TmdbMovieMapper {

    static toMovieWithCredits(data: TmdbMovieDetailsResponse): CreateContentDto {
        return {
            tmdbId: data.id,
            title: data.title,
            overview: data.overview,
            releaseDate: data.release_date,
            posterPath: data.poster_path,
            backdropPath: data.backdrop_path,
            popularity: data.popularity,

            adult: data.adult,
            genreIds: data.genres?.map((genre) => genre.id) ?? [],
            runtime: data.runtime,
            credits: TmdbCreditMapper.toContentCredits(data.credits),
        };
    }

    static toMovieList(data: TmdbMovieListResponse): Movie[] {

        const movies: Movie[] = data.results
            .filter(movie =>
                movie.id &&
                movie.title &&
                movie.poster_path &&
                movie.overview &&
                movie.release_date
            )
            .map(movie => ({
                tmdbId: movie.id,
                title: movie.title,
                overview: movie.overview,
                releaseDate: movie.release_date,
                posterPath: movie.poster_path,
                popularity: movie.popularity,
                genreIds: movie.genre_ids,
                adult: movie.adult
            }));

        return movies;
    }

    static toMovie(data: TmdbMovieResponse): Movie {
        const movie: Movie = {
            tmdbId: data.id,
            title: data.title,
            overview: data.overview,
            runtime: data.runtime,
            releaseDate: data.release_date,
            posterPath: data.poster_path,
            popularity: data.popularity,
            adult: data.adult
        };

        return movie;
    }

}