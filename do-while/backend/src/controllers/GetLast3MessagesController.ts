import { GetLast3MessagesService } from "../services/GetLast3MessagesService";
import { Request, Response } from "express";

class GetLast3MessagesController {
  async handle(_request: Request, response: Response) {
    const service = new GetLast3MessagesService();

    try {
      const result = await service.execute();
      return response.json(result);
    } catch (err) {
      return response.json({
        error: (err as Error).message,
      });
    }
  }
}

export { GetLast3MessagesController };
