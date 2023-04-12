import qs from "qs";
import crypto from "crypto-js";
import { paymentsQuery } from "../API/axios";
import { AppDataSource } from "../data-source";
import { Orders } from "../entity";
import { IPaymentRequest } from "../interface";
import DostavistaService from "./dostavista.service";
import ErrorService from "./error.service";

class PaymentService {
  async payment(id: number, ip: string) {
    console.log(id, ip);

    try {
      const order = await AppDataSource.getRepository(Orders).findOneBy({
        id,
      });

      if (!order) {
        throw ErrorService.BadRequest("Такого заказа не существует...");
      }

      const secret = `${process.env.ENDPOINT_ID}${order.id}${
        order.taking_amount * 100
      }${order.email}${process.env.MERCHANT_CONTROL}`;
      const controlHash = crypto.SHA1(secret).toString();

      let requestData: IPaymentRequest = {
        client_orderid: order.id,
        order_desc: `Оплата доставки №${order.id} на сумму ${order.taking_amount} руб.`,
        amount: order.taking_amount,
        currency: "RUB",
        address1: order.adress_from,
        city: "Moscow",
        zip_code: "000000",
        country: "RU",
        phone: order.customer_phone,
        email: order.email,
        ipaddress: ip,
        control: controlHash,
        server_callback_url: process.env.SERVER_CALLBACK_URL || "",
        redirect_url: `${process.env.REDIRECT_URL}` || "",
      };

      const res = await paymentsQuery.post(
        `${process.env.ENDPOINT_ID}`,
        requestData
      );
      console.log("Запрос на оплату улетел");

      const data = qs.parse(res.data);
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStatus(data: any) {
    console.log("Получил колбэк в сервисе");

    const orderForUpdate = await AppDataSource.getRepository(Orders).findOneBy({
      id: data.client_orderid,
    });

    console.log("Нашел оплаченный заказ");

    if (!orderForUpdate) {
      throw ErrorService.BadRequest("Такого заказа не существует");
    }

    // Нужно проверить статус оплаты, если ок то отправить заказ в достависту, если не ок, ничего не делать

    console.log("Изменил статус оплаты к заказу");

    orderForUpdate.payment_status = data.status;

    const orderRep = AppDataSource.getRepository(Orders);
    const order = await orderRep.save(orderForUpdate);

    console.log("Обновил данные в базе");

    if (data.staus === "declined") {
      throw ErrorService.BadRequest("Платеж был отклонен");
    }

    //Проверил оплачен ли заказ и проверил не отправлен ли он был уже в достависту
    if (data.status === "approved" && !order.dostavista_order_id) {
      const dostavistaService = new DostavistaService();
      const dostavistaOrderResponse = await dostavistaService.newOrder(order);
      orderForUpdate.dostavista_order_id = dostavistaOrderResponse.order_id;
      await orderRep.save(orderForUpdate);
      console.log("Отправил заказ в достависту");
    }

    return order;
  }
}

export default PaymentService;
