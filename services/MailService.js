import nodemailer from "nodemailer";

class MailService {
  async sendActivationLink(email, activationLink) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail as the email service
      auth: {
        user: process.env.MAIL_USER, // Your Gmail email address
        pass: process.env.MAIL_APP_PASS // Your Gmail password
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Подтверждение почты', // Subject line
      text: '', // Plain text body
      // потом сделать красивую обложку (адаптивную)
      html:
        `
                    <div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${activationLink}">Подтвердить адрес электронной почты</a>
                    </div>
                `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    return { tokens: '' };
  }
}

export default new MailService;