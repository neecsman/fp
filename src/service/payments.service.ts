import qs from "qs";
import { paymentsQuery } from "../API/axios";
import { AppDataSource } from "../data-source";
import { Orders } from "../entity";
import { IPaymentRequest } from "../interface";
import DostavistaService from "./dostavista.service";
import ErrorService from "./error.service";

class PaymentService {
  async payment(requestData: IPaymentRequest) {
    try {
      const res = await paymentsQuery.post(
        `${process.env.ENDPOINT_ID}`,
        requestData
      );
      console.log("Запрос на оплату улетел");

      const data = qs.parse(res.data);

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

    orderForUpdate.payment_status = data.status;

    const orderRep = AppDataSource.getRepository(Orders);
    const order = await orderRep.save(orderForUpdate);

    console.log("Обновил данные в базе");

    if (data.staus === "declined") {
      throw ErrorService.BadRequest("Платеж был отклонен");
    }

    if (data.status === "approved" && !order.dostavista_order_id) {
      const dostavistaService = new DostavistaService();
      const dostavistaOrderResponse = await dostavistaService.newOrder(order);
      orderForUpdate.dostavista_order_id = dostavistaOrderResponse.order_id;

      const savedOrder = await orderRep.save(orderForUpdate);
    }

    console.log("Отправил заказ в достависту");

    return order;
  }
}

export default PaymentService;
