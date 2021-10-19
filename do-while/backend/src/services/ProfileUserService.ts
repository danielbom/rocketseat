import prismaClient from "../prisma";

class ProfileUserService {
  async execute(user_id: string) {
    const messages = prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });
    return messages;
  }
}

export { ProfileUserService };
