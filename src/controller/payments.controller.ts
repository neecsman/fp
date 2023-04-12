import express from "express";
import { PaymentService } from "../service";

export class OrderController {
  async payOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.body;

      const paymentService = new PaymentService();
      const data = await paymentService.payment(id, req.ip);

      return res.json(data);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async callback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      console.log("Что-то пришло");

      const data = req.query;

      console.log("Получил колбэк в контроллере", data);

      const paymentService = new PaymentService();
      paymentService.updateStatus(data);

      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async redirect(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const data = req.query;
      console.log("Данные из редиректа", data);

      return res.status(301).redirect(`${process.env.CLIENT_URL}/orders`);
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
