import { Users } from "../entity";

import { AppDataSource } from "../data-source";

import { ErrorService, TokenService, MailService } from "../service";
import { UserDto } from "../dto";

import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { generate } from "shortid";
class UserService {
  async registration(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    middlename: string,
    phone: string
  ) {
    const candidate = await AppDataSource.getRepository(Users).findOneBy({
      email,
    });

    if (candidate) {
      throw ErrorService.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const confirmLink = v4();

    const user = new Users();
    user.email = email;
    user.password = hashPassword;
    user.confirmLink = confirmLink;
    user.phone = phone;
    user.firstname = firstname;
    user.lastname = lastname;
    user.middlename = middlename;

    await AppDataSource.manager.save(user);
    await MailService.sendActivationMail(email, confirmLink);

    const userDto = new UserDto(user);
    const tokenService = new TokenService();
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto },
    };
  }

  async login(email: string, password: string) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      email,
    });

    if (!user) {
      throw ErrorService.BadRequest("Пользователь c таким e-mail не найден");
    }

    const isPassVerify = await bcrypt.compare(password, user.password);

    if (!isPassVerify) {
      throw ErrorService.BadRequest("Неверный пароль");
    }

    const tokenService = new TokenService();
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto },
    };
  }

  async logout(refreshToken: string) {
    const tokenService = new TokenService();
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async recovery(email: string) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      email,
    });

    if (!user) {
      throw ErrorService.BadRequest("Пользователь c таким e-mail не найден");
    }

    const userDto = new UserDto(user);

    const newPassword = generate();
    await MailService.recovery(email, newPassword);

    const hashPassword = await bcrypt.hash(newPassword, 3);

    await AppDataSource.createQueryBuilder()
      .update(Users)
      .set({
        password: hashPassword,
      })
      .where("id = :id", { id: user.id })
      .execute();

    return { user: userDto };
  }

  async activate(id: string) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      id,
    });

    if (!user) {
      throw ErrorService.BadRequest("Пользователь не найден...");
    }

    await MailService.sendActivationMail(user.email, user.confirmLink);
    const userDto = new UserDto(user);
    return userDto;
  }

  async confirm(confirmLink: string) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      confirmLink,
    });

    if (!user) {
      throw ErrorService.BadRequest("Некорректная ссылка активации");
    }

    user.confirm = true;
    await AppDataSource.manager.save(user);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ErrorService.UnauthorizedError();
    }

    const tokenService = new TokenService();
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ErrorService.UnauthorizedError();
    }
    const user = await AppDataSource.getRepository(Users).findOneBy({
      id: userData.id,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.updateToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto },
    };
  }

  async update(
    id: string,
    firstname: string,
    lastname: string,
    middlename: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      id,
    });

    if (!user) {
      throw ErrorService.UnauthorizedError();
    }

    if (oldPassword && newPassword) {
      const isPassVerify = await bcrypt.compare(oldPassword, user.password);

      if (!isPassVerify) {
        throw ErrorService.BadRequest("Старый пароль не верный...");
      }

      const hashPassword = await bcrypt.hash(newPassword, 3);

      await AppDataSource.createQueryBuilder()
        .update(Users)
        .set({
          password: hashPassword,
        })
        .where("id = :id", { id: id })
        .execute();
    }

    await AppDataSource.createQueryBuilder()
      .update(Users)
      .set({
        firstname,
        lastname,
        middlename,
      })
      .where("id = :id", { id: id })
      .execute();

    const updatedUser = await AppDataSource.getRepository(Users).findOneBy({
      id,
    });

    const userDto = new UserDto(updatedUser);
    const tokenService = new TokenService();
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto },
    };
  }
}

export default UserService;
