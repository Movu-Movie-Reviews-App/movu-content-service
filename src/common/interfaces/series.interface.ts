import { Content } from "./content.interface";

export interface Series extends Content {

    numberOfSeasons?: number;

    numberOfEpisodes?: number;
}
