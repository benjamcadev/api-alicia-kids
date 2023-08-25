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
}

export const emailReserva = (correoCliente,clienteNombre,numeroReserva,fechaInicio,fechaTermino,totalReserva,direccionReserva) => {
  
  const mailReserva = {
    from: '"Alicia Kids" <alicia.kids.juegos@gmail.com>',
    to: correoCliente,
    cc: 'benjamca@icloud.com',
    subject: 'Reserva de juegos ✅ - Alicia Kids',
    text: 'Texto del correo',
    html: `<h1>FELICIDADES 🎉🎉</h1> <h2>${clienteNombre}, TU RESERVA SE HA HECHO CON EXITO ! ✅</h2>`+
    '<br>'+
    '<h3>Datos de la Reserva:</h3>'+
    '<br>'+
    `<p>Tu numero de reserva es: <b>${numeroReserva}</b></p>`+
    `<p>La fiesta empieza: <b>${fechaInicio}</b></p>`+
    `<p>Y termina: <b>${fechaTermino}</b></p>`+
    `<p>El precio total: <b>$${totalReserva}</b></p>`+
    `<p>El lugar de la fiesta es: <b>${direccionReserva}</b></p>`+
    '<br>'+
    `<h3>NOS VEMOS PRONTO PARA CELEBRAR CON ALICIA KIDS !!! 🥳🎈</h3>`
  }
  return mailReserva
} 