import express from "express";
import { PaymentService } from "../service";

export class OrderController {
  async callback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log("Что-то пришло");

    const data = req.query;

    console.log("Получил колбэк в контроллере", data);

    const paymentService = new PaymentService();
    paymentService.updateStatus(data);

    return res.status(200);
  }
}

export default OrderController;
