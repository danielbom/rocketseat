import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";

import { ensureAuthenticate } from "./middleware/ensureAuthenticated";

const routes = Router();

routes.post("/authenticate", new AuthenticateUserController().handle);

routes.post(
  "/messages",
  ensureAuthenticate,
  new CreateMessageController().handle
);

routes.get("/messages/last3", new GetLast3MessagesController().handle);

routes.get("/profile", new ProfileUserController().handle);

export { routes };
