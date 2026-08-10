import { ContentTypeEnum } from '../enums/content-type.enum';
export interface Genre {
    tmdbId: number;
    contentType: ContentTypeEnum;
    name: string;
}