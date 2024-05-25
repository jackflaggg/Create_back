export const AvailableResolutions: string[] = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];

export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions,
}

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,

    INTERNAL_SERVER_ERROR_500 = 500,
}

export type ErrorsMessageType = {
    field: string,
    message: string
}

export type ErrorsType = {
    errorsMessages: ErrorsMessageType[]
}