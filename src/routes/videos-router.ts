import {Request, Response, Router} from "express";
import {AvailableResolutions, CreateVideosType, ErrorsType, HTTP_STATUSES, RequestWithBody, VideoType} from "../types";
import {videos} from "../db";

export const videosRouter = Router();

videosRouter.get("/", (req: Request, res: Response<VideoType[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(videos)
});

videosRouter.get("/:id", (req: Request, res: Response<VideoType>) => {
    let {id: idVideos} = req.params;
    const videoFind = videos.find(elem => elem.id === +idVideos);
    if (!videoFind) {
        res.status(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).send(videoFind);
});

videosRouter.post("/", (req: RequestWithBody<CreateVideosType>, res: Response) => {
    const errors: ErrorsType = {
        errorsMessages: []
    };

    let {title, author, availableResolutions} = req.body;

    if (!title || typeof (title) !== "string" || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'incorrect titleVideo', field: "title"});
    }

    if (!author || typeof (author) !== "string" || !title.trim() || title.trim().length > 20) {
        errors.errorsMessages.push({message: 'incorrect authorVideo', field: "author"});
    }

    if(availableResolutions && availableResolutions instanceof Array) {
        availableResolutions.forEach(resolution => {
            !AvailableResolutions.includes(resolution) &&
            errors.errorsMessages.push(
                {
                    message: 'Incorrect availableResolutions!',
                    field: 'availableResolutions'
                });
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length){
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send(errors);
        return;
    }

    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(createdAt.getDate() + 1);

    const newVideo: VideoType = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    };
    videos.push(newVideo);
    return res
        .status(HTTP_STATUSES.CREATED_201)
        .send(newVideo);

})