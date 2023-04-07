import express from "express";
import { MailService } from "../service";

class MailController {
  async feedback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { email, title, text } = req.body;
    try {
      const data = await MailService.sendFeedbackMail(email, title, text);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async order(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { firstname, lastname, middlename, phone, email, order_id } =
      req.body;
    try {
      const data = await MailService.sendOrderMail(
        lastname,
        middlename,
        firstname,
        phone,
        email,
        order_id
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async candidate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const {
      lastname,
      middlename,
      firstname,
      phone,
      pasport_serial,
      start_time,
      end_time,
      reg_adress,
      index,
      email,
    } = req.body;
    try {
      const data = await MailService.sendCandidateMail(
        lastname,
        middlename,
        firstname,
        phone,
        pasport_serial,
        start_time,
        end_time,
        reg_adress,
        index,
        email
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default MailController;
