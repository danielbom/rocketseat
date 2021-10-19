import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      error: "token.invalid",
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Environment variable missing: JWT_SECRET");
  }

  try {
    const [, token] = authToken.split(" ");
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

    request.user_id = sub;
    return next();
  } catch (err) {
    return response.status(401).json({
      error: "token.expired",
    });
  }
}
