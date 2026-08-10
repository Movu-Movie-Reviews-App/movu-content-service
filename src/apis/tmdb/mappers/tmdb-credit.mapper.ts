import { CreateContentCreditDto } from "src/content/dto/create-content-credit.dto";
import { TmdbCast, TmdbMovieCreditsResponse } from "../interfaces/tmdb-movie-credits.response";

export class TmdbCreditMapper {

    static toContentCredits(data: TmdbMovieCreditsResponse): CreateContentCreditDto[] {

        return data.cast.map((creditMember: TmdbCast) => ({
            character: creditMember.character,
            person: {
                tmdbId: creditMember.id,
                name: creditMember.name,
                knownForDepartment: creditMember.known_for_department,
                profilePath: creditMember.profile_path ?? undefined,
            },
        }));
    }
}