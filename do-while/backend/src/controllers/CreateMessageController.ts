import { CreateMessageService } from "../services/CreateMessageService";
import { Request, Response } from "express";

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;

    const service = new CreateMessageService();

    try {
      const result = await service.execute(message, request.user_id);
      return response.json(result);
    } catch (err) {
      return response.json({
        error: (err as Error).message,
      });
    }
  }
}

export { CreateMessageController };
