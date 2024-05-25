import {AvailableResolutions} from "../types/types";

export type UpdateVideoInputModel = {
    title:	string,
    author:	string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string,
}