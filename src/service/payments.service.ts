import qs from "qs";
import { paymentsQuery } from "../API/axios";
import { AppDataSource } from "../data-source";
import { Orders } from "../entity";
import { IPaymentRequest } from "../interface";

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
    //Получить колбэк от сервера и обновить данные о статусе заказа в базе данных

    console.log("Данные из колбэка", data);

    const orderForUpdate = await AppDataSource.getRepository(Orders).findOneBy({
      id: data.id,
    });

    if (!orderForUpdate) {
      return;
    }

    // Нужно проверить статус оплаты, если ок то отправить заказ в достависту, если не ок, ничего не делать

    orderForUpdate.payment_status = "approved";

    const orderRep = AppDataSource.getRepository(Orders);
    const order = await orderRep.save(orderForUpdate);
    return order;
  }
}

export default PaymentService;
