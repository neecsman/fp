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

    if (!userData) {
      throw ErrorService.UnauthorizedError();
    }

    const result = await AppDataSource.getRepository(Orders)
      .createQueryBuilder("orders")
      .where("orders.userId = :id", { id: userData.id })
      .getMany();

    const orders = result.map((item) => item.dostavista_order_id);

    if (!orders.length) {
      return [];
    } else {
      const data = await baseQuery.get(`/orders`, {
        params: {
          order_id: orders,
        },
      });
      return data.data.orders;
    }
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

        //Формируем запрос на оплату

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
          ipaddress: userIP,
          control: controlHash,
          server_callback_url: process.env.SERVER_CALLBACK_URL || "",
          redirect_success_url:
            `${process.env.REDIRECT_SECCESS_URL}${order.id}` || "",
          redirect_fail_url:
            `${process.env.REDIRECT_FAIL_URL}${order.id}` || "",
        };

        console.log("Объект запроса в connpay", requestData);

        const paymentService = new PaymentService();

        //Отправили запрос на оплату
        const paymentResponse = await paymentService.payment(requestData); // Получили ответ с redirect 3DS
        console.log("Ответ от connpay", paymentResponse);

        //Сделать редирект с номером заказа и на клиенте получать данные заказа из url через router params

        const userDto = new UserDto(candidate);

        return {
          data: paymentResponse,
          refreshToken: null,
          accessToken: null,
          user: userDto,
        };
      }

      if (!candidate) {
        //регистрируем и создаем заказ

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

        const secret = `${process.env.ENDPOINT_ID}${order.id}${
          order.taking_amount * 100
        }${order.email}${process.env.MERCHANT_CONTROL}`;
        const controlHash = crypto.SHA1(secret).toString();

        console.log("Контрольная сумма", controlHash);

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
          ipaddress: userIP,
          control: controlHash,
          server_callback_url: process.env.SERVER_CALLBACK_URL || "",
          redirect_success_url:
            `${process.env.REDIRECT_SECCESS_URL}${order.id}` || "",
          redirect_fail_url:
            `${process.env.REDIRECT_FAIL_URL}${order.id}` || "",
        };

        console.log("Сформировали объект запроса в connpay", requestData);

        const paymentService = new PaymentService();

        //Отправили запрос на оплату
        const paymentResponse = await paymentService.payment(requestData);

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
        return { ...tokens, data: dostavistaOrder, user: userDto };
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
        order: dostavistaOrder,
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

  async cancelOrder(orderId: object) {
    const data = await baseQuery.post("/cancel-order", orderId);
    return data.data;
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
