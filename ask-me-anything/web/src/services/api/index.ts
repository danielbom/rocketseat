import Api, { Config } from "./api";

const config = new Config(import.meta.env.VITE_APP_API_URL);
export const api = new Api(config);

export type * from "./api";
