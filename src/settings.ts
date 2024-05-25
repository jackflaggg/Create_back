import {config} from 'dotenv';
config()
export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    RouterPaths: {
        videos: "/videos",
        testingAllData: "/testing/all-data"
    }
}