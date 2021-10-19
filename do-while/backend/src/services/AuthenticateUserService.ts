import axios from "axios";
import { sign } from "jsonwebtoken";
import prismaClient from "../prisma";

/**
 * Receber código do github (string)
 * Recuperar o access_token no github
 * Verificar se o usuário existe no DB
 * -- SIM = Gerar um token
 * -- NAO = Adicionar usuário no DB, e gerar o token
 * Retornar o token com as informações do usuário
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

class AuthenticateUserService {
  async execute(code: string): Promise<any> {
    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(
        "https://github.com/login/oauth/access_token",
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

    const { data: userResponse } = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: "Bearer " + accessTokenResponse.access_token,
        },
      }
    );

    let user = await prismaClient.user.findFirst({
      where: { github_id: userResponse.id },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: userResponse.id,
          login: userResponse.login,
          avatar_url: userResponse.avatar_url,
          name: userResponse.name,
        },
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("Environment variable missing: JWT_SECRET");
    }

    const token = sign(
      {
        user: {
          id: user.id,
          avatar_url: user.avatar_url,
          name: user.name,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
