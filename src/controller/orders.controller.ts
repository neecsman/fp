import express from "express";
import { OrderService } from "../service";
import { IOrder } from "../interface";

export class OrderController {
  async getOrders(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { refreshToken } = req.cookies;
      const orderService = new OrderService();
      const data = await orderService.getOrders(refreshToken);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const order = req.body;
      const orderService = new OrderService();

      if (order.payments_method === "card") {
        const data = await orderService.createOrderWithCard(order, req.ip);

        if (data && data.refreshToken) {
          res.cookie("refreshToken", data.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
        }

        return res.json(data);
      }

      if (order.payments_method === "cash") {
        const data = await orderService.createOrderWithCash(order);

        if (data && data.refreshToken) {
          res.cookie("refreshToken", data.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
        }

        console.log("Оплата наличными");
        return res.json(data);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async calcOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const order = req.body;
      const orderService = new OrderService();
      const data = await orderService.calcOrder(order);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { order_id } = req.body;
      const orderService = new OrderService();
      const data = await orderService.cancelOrder(order_id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getStatus(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const id = req.query.id;
      const orderService = new OrderService();
      const order = await orderService.getStatus(id);

      return res.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
