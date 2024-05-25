import {Request, Response, Router} from "express";
import {
    AvailableResolutions,
    CreateVideosType,
    ErrorsType,
    HTTP_STATUSES,
    RequestWithBody,
    RequestWithParamsAndBody, UpdateVideoInputModel,
    VideoType
} from "../types/types";
import {videos} from "../db";
import {validateDate} from "../validators/validDate";

export const videosRouter = Router();

videosRouter.get("/", (req: Request,
                       res: Response<VideoType[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(videos)
});

videosRouter.get("/:id", (req: Request,
                          res: Response<VideoType>) => {
    let {id: idVideos} = req.params;
    const videoFind = videos.find(elem => elem.id === +idVideos);
    if (!videoFind) {
        res.status(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).send(videoFind);
});

videosRouter.post("/", (req: RequestWithBody<CreateVideosType>,
                        res: Response<VideoType | ErrorsType>) => {
    const errors: ErrorsType = {
        errorsMessages: []
    };

    let {title, author, availableResolutions} = req.body;

    if (!title || typeof (title) !== "string" || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'incorrect titleVideo', field: "title"});
    }

    if (!author || typeof (author) !== "string" || !author.trim() || author.trim().length > 20) {
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

videosRouter.put("/:id", (req: RequestWithParamsAndBody<{id: string}, UpdateVideoInputModel>,
                          res: Response<VideoType | ErrorsType>) => {
    let errors: ErrorsType = { errorsMessages: [] };
    let {title, author, canBeDownloaded, minAgeRestriction, publicationDate, availableResolutions} = req.body;

    if (Object.entries(req.body).length === 0){
        //проверка на пустоту req.body
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    if (!title || typeof (title) !== "string" || !title.trim() || title.length > 40){
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'});
    }

    if (!author || typeof (author) !== "string" || !author.trim() || author.length > 20){
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'});
    }

    if (typeof (canBeDownloaded) !== "boolean"){
        errors.errorsMessages.push({message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded'});
    }

    if (minAgeRestriction !== null && (typeof (minAgeRestriction) !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18)){
        errors.errorsMessages.push({message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction'});
    }

    if (!publicationDate || !(validateDate(publicationDate))){
        errors.errorsMessages.push({message: 'Incorrect publicationDate', field: 'publicationDate'});
    }

    if (Array.isArray(availableResolutions)) {
        for (const r of availableResolutions) {
            if (!availableResolutions.includes(r)) {
                errors.errorsMessages.push({ message: 'Incorrect availableResolutions!', field: 'availableResolutions' });
                break; // Прерывает выполнение цикла
            }
        }
    } else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length){
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send(errors);
        return;
    }

    let id = +req.params.id;
    let video = videos.find((v) => v.id === id);
    if (video) {
        Object.assign(video, {
            ...video,
            title,
            author,
            canBeDownloaded,
            minAgeRestriction,
            publicationDate,
            availableResolutions
        })

        return res
            .status(HTTP_STATUSES.NO_CONTENT_204)
            .send(video);
    } else {
        return res
            .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
})

videosRouter.delete("/:id", (req: Request<{id: string}>, res: Response) => {
    let id = +req.params.id;
    videos.filter((element, index, array) => {
        if (videos[index].id === id){
            videos.splice(index, 1);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return;
        }
    })
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

})