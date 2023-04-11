import nodemailer from "nodemailer";
import ErrorService from "./error.service";
import "dotenv/config";
class MailService {
  async sendActivationMail(email: string, confirmLink: string) {
    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: email,
        subject: "Активация аккаунта",
        text: "",
        html: `
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 20px;">Активация аккаунта!</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 12px;">Здравствуйте! Вы зарегистрировались на сервисе FastPoints - служба доставки. Если вы не делали этого, просто проигнорируйте данное сообщение сообщение!</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;">
                
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
        <tbody><tr>
          <td align="center" bgcolor="#00C6BC" role="presentation" style="border:none;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#00C6BC;" valign="middle">
            <a href="${process.env.SERVER_URL}/user/activate/${confirmLink}" style="display: inline-block; background: #00C6BC; color: #000000; font-family: Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: normal; line-height: 100%; margin: 0; text-decoration: none; text-transform: none; padding: 9px 26px 9px 26px; mso-padding-alt: 0px; border-radius: 24px;" target="_blank">
              <span>Активировать аккаунт!</span>
            </a>
          </td>
        </tr>
      </tbody></table>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">С уважением, команда FastPoints!</p></div>
    
              </td>
            </tr>
          
      </tbody></table>
                  `,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async recovery(email: string, newPassword: string) {
    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: email,
        subject: "Восстановление пароля",
        text: "",
        html: `
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 20px;">Восстановление пароля!</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 12px;">Здравствуйте! Вы запросили новый пароль для учетной записи FastPoints - служба доставки. Это временный пароль, изменить его можно в личном кабинете в разделе "профиль"</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;">
                
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
        <tbody><tr>
          <td align="center" role="presentation" style="mso-padding-alt:9px 26px 9px 26px;" valign="middle">
          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 20px;">Ваш временный пароль: ${newPassword}</span></p></div>
          </td>
        </tr>
      </tbody></table>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">С уважением, команда FastPoints!</p></div>
    
              </td>
            </tr>
          
      </tbody></table>
                  `,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendRegistrationMail(email: string, newPassword: string) {
    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      console.log("Отправка сообщения на почту с паролем из сервиса");

      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: email,
        subject: "Регистрация пользователя",
        text: "",
        html: `
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 20px;">Регистрация на FastPoints!</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 12px;">Здравствуйте! Вы сделали заказ на FastPoints - служба доставки. Это временный пароль, изменить его можно в личном кабинете в разделе "Настройки"!</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;">
                
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
        <tbody><tr>
          <td align="center" role="presentation" style="mso-padding-alt:9px 26px 9px 26px;" valign="middle">
          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="font-size: 20px;">Ваш временный пароль: ${newPassword}</span></p></div>
          </td>
        </tr>
      </tbody></table>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">С уважением, команда FastPoints!</p></div>
    
              </td>
            </tr>
          
      </tbody></table>
                  `,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendFeedbackMail(email: string, title: string, text: string) {
    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: "nikappleid@yandex.ru",
        subject: "Обратная связь",
        text: "",
        html: `
        
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><h1 style="font-family: 'Cabin', sans-serif; font-size: 22px; text-align: center;"><span style="color: rgb(206, 212, 217);">Обратная связь</span></h1></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #4D4D4D; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #4D4D4D;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><h2 style="font-size: 17px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);">Почта:</span></h2>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);"><a style="color: rgb(206, 212, 217);" href="mailto:${email}" target="_blank" rel="noopener">${email}</a></span></p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">&nbsp;</p>
<h2 style="font-size: 17px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);">Заголовок сообщения:&nbsp;</span></h2>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">&nbsp;</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);">${title}&nbsp;</span></p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">&nbsp;</p>
<h2 style="font-size: 17px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);">Сообщение:</span></h2>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">&nbsp;</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(206, 212, 217);">${text}</span></p></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #4D4D4D; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #4D4D4D;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: rgb(236, 240, 241);">С уважением, команда Fast Points!</span></p></div>
    
              </td>
            </tr>
          
      </tbody></table>

        `,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendCandidateMail(
    lastname: string,
    middlename: string,
    firstname: string,
    phone: string,
    pasport_serial: string,
    start_time: string,
    end_time: string,
    reg_adress: string,
    index: string,
    email: string
  ) {
    const birtharray = start_time.split(".");
    const passdatearay = end_time.split(".");

    console.log(birtharray);
    console.log(passdatearay);

    if (Number(birtharray[1]) > 12 || Number(birtharray[1]) < 1) {
      throw ErrorService.BadRequest(
        "Поправьте дату рождения, в году всего 12 месяцев :)"
      );
    }

    if (Number(birtharray[2]) > 2005) {
      throw ErrorService.BadRequest("К сожалению, вы слишком юны...");
    }
    if (Number(birtharray[2]) < 1965) {
      throw ErrorService.BadRequest(
        "К сожалению, вы уже в возрасте, мы не можем вас принять..."
      );
    }

    if (Number(passdatearay[1]) > 12 || Number(passdatearay[1]) < 1) {
      throw ErrorService.BadRequest(
        "Поправьте дату выдачи паспорта, в году всего 12 месяцев :)"
      );
    }

    if (Number(passdatearay[2]) > 2023) {
      throw ErrorService.BadRequest("А вы точно из будущего?");
    }
    if (Number(passdatearay[2]) < 1965) {
      throw ErrorService.BadRequest(
        "К сожалению, ваш возраст не соответствует нашим требованиям..."
      );
    }

    if (2023 - Number(birtharray[2]) < 18) {
      throw ErrorService.BadRequest(
        "К сожалению, ваш возраст не соответствует нашим требованиям... Вам должно быть от 18 лет!"
      );
    }

    if (Number(passdatearay[2]) - Number(birtharray[2]) < 14) {
      throw ErrorService.BadRequest(
        "Вы не могли получить паспорт раньше 14 лет..."
      );
    }

    if (Number(passdatearay[2]) > 2023) {
      throw ErrorService.BadRequest(
        "С гостями из будущего мы не сотрудничасем :) Простите нас!"
      );
    }

    // function dateHandler(date: string) {
    //   const array = date.split(".").reverse();
    //   const newDate = new Date(
    //     Number(array[0]),
    //     Number(array[1]) - 1,
    //     Number(array[2])
    //   );
    //   return newDate;
    // }

    // const birthday = dateHandler(start_time);
    // const getPassDate = dateHandler(end_time);

    // const getAge = (date: Date) =>
    //   Math.floor(
    //     (new Date().valueOf() - new Date(date).getTime()) / 3.15576e10
    //   );

    // const candidateAge = getAge(birthday);
    // const passAge = getAge(getPassDate);

    // if (candidateAge < 18) {
    //   throw ErrorService.BadRequest(
    //     "К сожалению, ваш возраст не соответствует нашим требованиям..."
    //   );
    // }

    // if (candidateAge - passAge < 14) {
    //   throw ErrorService.BadRequest(
    //     "Дата выдачи паспорта не соответствует минимальному возрасту..."
    //   );
    // }

    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: "nikappleid@yandex.ru",
        subject: "Анкета кандидата",
        text: "",
        html: `
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><h1 style="font-family: 'Cabin', sans-serif; font-size: 22px; text-align: center;">Анкета кандидата</h1></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Фамилия: ${lastname}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Имя: ${firstname}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Отчество: ${middlename}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Дата рождения: ${start_time}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Дата выдачи паспорта: ${end_time}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Серия и номер паспорта: ${pasport_serial}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Адрес регистрации: ${reg_adress}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Индекс: ${index}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Номер телефона: ${phone}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Почта: ${email}</p></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;padding-right:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">С уважением, команда Fast Points!</p></div>
    
              </td>
            </tr>
          
      </tbody></table>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendOrderMail(
    lastname: string,
    middlename: string,
    firstname: string,
    phone: string,
    email: string,
    order_id: number
  ) {
    const options = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    try {
      let transporter = nodemailer.createTransport(options);
      await transporter.sendMail({
        from: `Fast Points ${process.env.SMTP_USER}`,
        to: "nikappleid@yandex.ru",
        subject: "Новый заказ Fast Points",
        text: "",
        html: `
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:transparent;background-color:transparent;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
            
      <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        
            <tbody><tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><h1 style="font-family: 'Cabin', sans-serif; font-size: 22px; text-align: center;">Новый заказ</h1></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Фамилия: ${lastname}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Имя: ${firstname}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Отчество: ${middlename}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Номер телефона: ${phone}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Почта: ${email}</p>
<p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">Заказ: ${order_id}</p></div>
    
              </td>
            </tr>
          
            <tr>
              <td style="font-size:0px;padding:10px 10px;padding-top:10px;word-break:break-word;">
                
      <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #000000; font-size: 1; margin: 0px auto; width: 100%;">
      </p>
      
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    
    
              </td>
            </tr>
          
            <tr>
              <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;">
                
      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;">С уважением, команда Fast Points!</p></div>
    
              </td>
            </tr>
          
      </tbody></table>
    
      </div>
    
          <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new MailService();
