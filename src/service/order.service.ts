import crypto from "crypto-js";
import { generate } from "shortid";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Orders, Users } from "../entity";
import baseQuery from "../API/axios";
import {
  ErrorService,
  TokenService,
  PaymentService,
  MailService,
  DostavistaService,
} from "../service";
import { AppDataSource } from "../data-source";
import IOrder from "../interface/IOrder";
import { IPaymentRequest } from "../interface";
import { UserDto } from "../dto";

class OrderService {
  async getOrders(refreshToken: string) {
    if (!refreshToken) {
      throw ErrorService.UnauthorizedError();
    }

    const tokenService = new TokenService();
    const userData = tokenService.validateRefreshToken(refreshToken);
    console.log(userData);

    if (!userData) {
      throw ErrorService.UnauthorizedError();
    }

    const orders = await AppDataSource.getRepository(Orders)
      .createQueryBuilder("orders")
      .where("orders.userId = :id", { id: userData.id })
      .orderBy("created_datetime", "DESC")
      .getMany();

    const dostavistaOrderID: any = [];

    orders.forEach((item) => {
      if (item.dostavista_order_id) {
        dostavistaOrderID.push(item.dostavista_order_id);
      }
    });

    if (dostavistaOrderID.length) {
      const dostavistaOrders = await baseQuery.get("orders", {
        params: { order_id: dostavistaOrderID },
      });

      if (dostavistaOrders) {
        dostavistaOrders.data.orders.forEach(async (item: any) => {
          const order = await AppDataSource.getRepository(Orders).findOneBy({
            dostavista_order_id: item.order_id,
          });

          if (!order) {
            return;
          }
          order.dostavista_order_status = item.status;
          AppDataSource.getRepository(Orders).save(order);
        });
      }
    }

    return orders;
  }

  async createOrderWithCard(data: IOrder, userIP: string) {
    const validate = (e: any) => /^((\+7|7|8)+([9-9])+([0-9]){9})$/i.test(e);

    if (!validate(data.phone_from)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона отправителя... 🥲"
      );
    }

    if (!validate(data.phone_where)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона получателя... 🥲"
      );
    }

    console.log("Попали в сервис");

    try {
      //Проверяем есть ли пользователь с таким email
      const candidate = await AppDataSource.getRepository(Users).findOneBy({
        email: data.email,
      });

      if (candidate) {
        //создаемзаказ
        const orderRep = AppDataSource.getRepository(Orders);
        const order = orderRep.create(data);
        order.userId = candidate.id;
        const savedOrder = await orderRep.save(order);

        const paymentService = new PaymentService();
        const paymentResponse = await paymentService.payment(
          savedOrder.id,
          userIP
        ); // Получили ответ с redirect 3DS

        console.log("Ответ от connpay", paymentResponse);

        const userDto = new UserDto(candidate);

        return {
          data: paymentResponse,
          refreshToken: null,
          accessToken: null,
          user: userDto,
        };
      }

      if (!candidate) {
        console.log("Регистрируем пользователя");

        const newPassword = generate();
        const hashPassword = await bcrypt.hash(newPassword, 3);
        const confirmLink = v4();

        const user = new Users();
        user.email = data.email;
        user.password = hashPassword;
        user.confirmLink = confirmLink;
        user.phone = data.customer_phone;
        user.firstname = data.customer_firstname;
        user.lastname = data.customer_lastname;
        user.middlename = data.customer_middlename;

        const newUser = await AppDataSource.manager.save(user);

        console.log("Отправляем email");
        await MailService.sendRegistrationMail(data.email, newPassword);

        console.log("Создаем заказ в базе данных");

        const orderRep = AppDataSource.getRepository(Orders);
        const order = orderRep.create(data);
        order.userId = newUser.id;
        const savedOrder = await orderRep.save(order);

        console.log("Создаем токены");

        const userDto = new UserDto(newUser);
        const tokenService = new TokenService();
        const tokens = tokenService.generateToken({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        console.log("Создем хэш оплаты");
        const paymentService = new PaymentService();

        const paymentResponse = await paymentService.payment(
          savedOrder.id,
          userIP
        );

        console.log("Получили ответ от connpay", paymentResponse);

        return { ...tokens, data: paymentResponse, user: userDto };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createOrderWithCash(data: IOrder) {
    const validate = (e: any) => /^((\+7|7|8)+([9-9])+([0-9]){9})$/i.test(e);

    if (!validate(data.phone_from)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона отправителя... 🥲"
      );
    }

    if (!validate(data.phone_where)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона получателя... 🥲"
      );
    }

    try {
      //Проверяем есть ли пользователь с таким email
      const candidate = await AppDataSource.getRepository(Users).findOneBy({
        email: data.email,
      });

      if (!candidate) {
        //Регистрируем
        console.log("Такого пользователя нет");

        //Создаем пользователя
        const newPassword = generate();
        const hashPassword = await bcrypt.hash(newPassword, 3);
        const confirmLink = v4();

        const user = new Users();
        user.email = data.email;
        user.password = hashPassword;
        user.confirmLink = confirmLink;
        user.phone = data.customer_phone;
        user.firstname = data.customer_firstname;
        user.lastname = data.customer_lastname;
        user.middlename = data.customer_middlename;

        console.log("Создали пользователя", user);

        const newUser = await AppDataSource.manager.save(user);
        await MailService.sendRegistrationMail(data.email, newPassword);

        //Создаем ему токен доступа
        const userDto = new UserDto(newUser);
        const tokenService = new TokenService();
        const tokens = tokenService.generateToken({ ...userDto });

        console.log("Создали токены", tokens);

        //сохранили токены в БД
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        // Нужно отправить пароль на email

        // Создаем заказ
        const orderRep = AppDataSource.getRepository(Orders);
        const order = orderRep.create(data);
        order.userId = newUser.id;
        const savedOrder = await orderRep.save(order);
        console.log("Сохранили заказ", savedOrder);

        const dostavistaService = new DostavistaService();
        const dostavistaOrder = await dostavistaService.newOrder(savedOrder);

        //Возвращаем на клиент токен и заказ
        return { ...tokens, data: savedOrder, user: userDto };
      }

      console.log("Есть такой чел");
      //создаем заказ
      const orderRep = AppDataSource.getRepository(Orders);
      const order = orderRep.create(data);
      order.userId = candidate.id;
      const savedOrder = await orderRep.save(order);

      //Отправляем заказ в достависту
      const dostavistaService = new DostavistaService();
      const dostavistaOrder = await dostavistaService.newOrder(savedOrder);

      const userDto = new UserDto(candidate);

      //Токен не нужен поскольку пользователь уже зарегистрировался и токен хранится у него в локале

      return {
        order: savedOrder,
        user: userDto,
        accessToken: null,
        refreshToken: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async calcOrder(order: IOrder) {
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

  async cancelOrder(id: number) {
    const order = await AppDataSource.getRepository(Orders).findOneBy({
      id,
    });

    if (!order) {
      throw ErrorService.BadRequest("Такого заказа не существует...");
    }
    if (order.dostavista_order_id) {
      const data = await baseQuery.post("/cancel-order", {
        order_id: order.dostavista_order_id,
      });
      order.dostavista_order_status = "canceled";
      await AppDataSource.getRepository(Orders).save(order);
      return data.data;
    }

    order.dostavista_order_status = "canceled";
    await AppDataSource.getRepository(Orders).save(order);
    return order;
  }

  async getStatus(id: any) {
    const order = await AppDataSource.getRepository(Orders).findOneBy({ id });
    if (!order) {
      throw ErrorService.BadRequest("Такого заказа не существует");
    }

    return order;
  }
}

export default OrderService;
