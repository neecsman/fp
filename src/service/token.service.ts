import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Tokens } from "../entity";
import { IToken } from "../interface";

class TokenService {
  generateToken(payload: any) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "30m",
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as IToken;
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as IToken;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    await AppDataSource.manager.insert(Tokens, { userId, refreshToken });
  }

  async updateToken(userId: string, refreshToken: string) {
    await AppDataSource.getRepository(Tokens)
      .createQueryBuilder()
      .update(Tokens)
      .set({ refreshToken: refreshToken })
      .where("userId = :id", { id: userId })
      .execute();
  }

  async removeToken(refreshToken: string) {
    await AppDataSource.manager.delete(Tokens, { refreshToken });
  }

  async findToken(refreshToken: string) {
    const tokenData = await AppDataSource.getRepository(Tokens).findOne({
      where: {
        refreshToken,
      },
    });
    return tokenData;
  }
}

export default TokenService;
