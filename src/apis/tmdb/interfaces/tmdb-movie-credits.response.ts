
export interface TmdbMovieCreditsResponse {
    id: number;
    cast: TmdbCast[];
    crew: TmdbCast[];
}

export interface TmdbCast {
    gender: number;
    id: number;
    known_for_department: TmdbDepartment;
    name: string;
    original_name: string;
    profile_path: null | string;
    character?: string;
}

export enum TmdbDepartment {
    Acting = "Acting",
    Art = "Art",
    Camera = "Camera",
    CostumeMakeUp = "Costume & Make-Up",
    Crew = "Crew",
    Directing = "Directing",
    Editing = "Editing",
    Lighting = "Lighting",
    Production = "Production",
    Sound = "Sound",
    VisualEffects = "Visual Effects",
    Writing = "Writing",
}
