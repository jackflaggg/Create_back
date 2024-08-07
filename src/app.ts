import express, {Express, Request, Response} from "express";
import {SETTINGS} from "./settings";
import {videosRouter} from "./routes/videos-router";
import {videos} from "./db/db";
import {HTTP_STATUSES} from "./types/types";

export const app: Express = express();

app.use(express.json());
app.use(SETTINGS.RouterPaths.videos, videosRouter);

app.delete(SETTINGS.RouterPaths.testingAllData, (req: Request, res: Response) => {
    videos.length = 0;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
