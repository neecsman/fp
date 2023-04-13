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
      const data = req.query;

      console.log("Получил колбэк в контроллере", data);

      const paymentService = new PaymentService();
      paymentService.updateStatus(data);

      console.log("ок вернули");

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      console.log("Сработал catch в callback");

      next(error);
    }
  }

  async redirect(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const data = req.body;
      if (data.status === "approved") {
        return res
          .status(301)
          .redirect(
            `${process.env.CLIENT_URL}/orders/success/${data.client_orderid}`
          );
      } else {
        return res
          .status(301)
          .redirect(
            `${process.env.CLIENT_URL}/orders/fail/${data.client_orderid}`
          );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default OrderController;
