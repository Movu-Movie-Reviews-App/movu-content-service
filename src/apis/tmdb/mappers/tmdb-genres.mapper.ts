import { Genre } from "src/common/interfaces/genre.interface";
import { TmdbMovieGenresResponse } from "../interfaces";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";

export class TmdbGenresMapper {

    static toMovieGenre(data: TmdbMovieGenresResponse): Genre[] {
        const genres: Genre[] = data.genres.map(genre => ({
            tmdbId: genre.id,
            contentType: ContentTypeEnum.MOVIE,
            name: genre.name
        }));

        return genres;
    }

    static toSeriesGenre(data: TmdbMovieGenresResponse): Genre[] {
        const genres: Genre[] = data.genres.map(genre => ({
            tmdbId: genre.id,
            contentType: ContentTypeEnum.SERIES,
            name: genre.name
        }));
        return genres;
    }

}