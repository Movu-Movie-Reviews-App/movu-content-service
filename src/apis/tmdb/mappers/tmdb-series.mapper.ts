import { Series } from "src/common/interfaces/series.interface";
import { CreateContentDto } from "src/content/dto/create-content.dto";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";
import { TmdbSeriesListResponse } from "../interfaces";
import { TmdbSeriesDetailsResponse, TmdbSeriesResponse } from "../interfaces/tmdb-series-response";
import { TmdbCreditMapper } from "./tmdb-credit.mapper";

export class TmdbSeriesMapper {

    static toSeriesWithCredits(data: TmdbSeriesDetailsResponse): CreateContentDto {
        return {
            tmdbId: data.id,
            title: data.name,
            overview: data.overview,
            releaseDate: data.first_air_date,
            posterPath: data.poster_path,
            backdropPath: data.backdrop_path,
            popularity: data.popularity,
            adult: data.adult,
            genreIds: data.genres?.map((genre) => genre.id) ?? [],
            type: ContentTypeEnum.SERIES,
            numberOfSeasons: data.number_of_seasons,
            numberOfEpisodes: data.number_of_episodes,
            credits: TmdbCreditMapper.toContentCredits(data.credits),
        };
    }

    static toSeriesList(data: TmdbSeriesListResponse): Series[] {

        const series: Series[] = data.results
            .filter(serie =>
                serie.id &&
                serie.name &&
                serie.poster_path &&
                serie.overview &&
                serie.first_air_date
            )
            .map(serie => ({
                tmdbId: serie.id,
                title: serie.name,
                overview: serie.overview,
                releaseDate: serie.first_air_date,
                posterPath: serie.poster_path,
                popularity: serie.popularity,
                genreIds: serie.genre_ids,
                adult: serie.adult
            }));

        return series;
    }

    static toSeries(data: TmdbSeriesResponse): Series {
        const series: Series = {
            tmdbId: data.id,
            title: data.name,
            overview: data.overview,
            numberOfSeasons: data.number_of_seasons,
            numberOfEpisodes: data.number_of_episodes,
            releaseDate: data.first_air_date,
            posterPath: data.poster_path,
            popularity: data.popularity,
            adult: data.adult
        };

        return series;
    }

}
