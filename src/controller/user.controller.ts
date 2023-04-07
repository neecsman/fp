import express from "express";
import { UserService } from "../service";
class UserController {
  async registration(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email, password, firstname, lastname, middlename, phone } =
        req.body;
      const userService = new UserService();
      const userData = await userService.registration(
        email,
        password,
        firstname,
        lastname,
        middlename,
        phone
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const userService = new UserService();
      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        user: userData.user,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { refreshToken } = req.cookies;

      const userService = new UserService();
      const token = userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async recovery(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email } = req.body;
      const userService = new UserService();
      const data = await userService.recovery(email);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { refreshToken } = req.cookies;
      const userService = new UserService();
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        accessToken: userData.accessToken,
        user: userData.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.body;
      const userService = new UserService();
      const data = await userService.activate(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async confirm(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const activationLink = req.params.link;
      const userService = new UserService();
      await userService.confirm(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}/profile`);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { firstname, lastname, middlename, oldPassword, newPassword, id } =
        req.body;
      const userService = new UserService();
      const userData = await userService.update(
        id,
        firstname,
        lastname,
        middlename,
        oldPassword,
        newPassword
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
