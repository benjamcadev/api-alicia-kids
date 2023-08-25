import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alicia.kids.juegos@gmail.com',
      pass: process.env.APP_PASSWORD_GMAIL //Pasar a .env
    }
  });


export const sendEmail = async(mail) => {
  // send mail with defined transport object
  const info = await transporter.sendMail(mail)
  return info

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

