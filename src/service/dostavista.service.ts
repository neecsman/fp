import baseQuery from "../API/axios";
import { AppDataSource } from "../data-source";
import { Orders } from "../entity";
import IOrder from "../interface/IOrder";

class DostavistaService {
  async newOrder(data: IOrder) {
    const orderInfo = {
      vehicle_type_id: data.how_delivery,
      matter: data.object,
      insurance_amount: data.object_price,
      total_weight_kg: data.total_weight,
      points: [
        {
          address: data.adress_from,
          contact_person: { name: data.name_from, phone: data.phone_from },
          taking_amount: data.payments_adress == "1" ? data.taking_amount : "",
          note: data.note_from || "",
          required_start_datetime: data.start_time || "",
        },
        {
          address: data.adress_where,
          contact_person: { name: data.name_where, phone: data.phone_where },
          taking_amount: data.payments_adress == "2" ? data.taking_amount : "",
          note: data.note_where || "",
          required_start_datetime: data.end_time || "",
        },
      ],
    };

    const res = await baseQuery.post("create-order", orderInfo);

    if (res.data.is_successful) {
      const orderRep = AppDataSource.getRepository(Orders);
      const order = await orderRep.findOneBy({
        id: data.id,
      });

      if (order) {
        order.dostavista_order_id = res.data.order.order_id;
        order.dostavista_order_status = res.data.order.status;
        const orderFromDostavista = await orderRep.save(order);
        return orderFromDostavista;
      }
    }

    console.log("Заказ из достависты", res.data);

    return res.data;
  }

  async calcOrder(order: any) {
    const orderInfo = {
      vehicle_type_id: order.how_delivery,
      matter: order.object,
      insurance_amount: order.object_price,
      total_weight_kg: order.total_weight,
      points: [
        {
          address: order.adress_from,
          contact_person: { phone: order.phone_from },
          required_start_datetime: order.start_time || null,
        },
        {
          address: order.adress_where,
          contact_person: { phone: order.phone_where },
          required_start_datetime: order.end_time || null,
        },
      ],
    };

    const data = await baseQuery.post("/calculate-order", orderInfo);
    return data.data;
  }

  async cancelOrder() {}
}

export default DostavistaService;
