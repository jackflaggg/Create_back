import express, {Express, Request, Response} from "express";
import {SETTINGS} from "./settings";
import {videosRouter} from "./routes/videos-router";
// import cors from 'cors';

export const app: Express = express();

app.use(express.json());
// app.use(cors());
app.use(SETTINGS.RouterPaths.videos, videosRouter);

