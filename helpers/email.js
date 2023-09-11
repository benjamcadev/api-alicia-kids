import nodemailer from 'nodemailer'
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ruta = __dirname.replace('helpers','')

console.log(ruta)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alicia.kids.juegos@gmail.com',
    pass: process.env.APP_PASSWORD_GMAIL //Pasar a .env
  }
});


export const sendEmail = async (mail) => {
  // send mail with defined transport object
  const info = await transporter.sendMail(mail)
  return info
}

export const emailReserva = (correoCliente, clienteNombre, numeroReserva, fechaInicio, fechaTermino, totalReserva, direccionReserva) => {

  const mailReserva = {
    from: '"Alicia Kids" <alicia.kids.juegos@gmail.com>',
    to: correoCliente,
    cc: 'benjamca@hotmail.com',
    subject: 'Reserva de juegos ✅ - Alicia Kids',
    text: 'Texto del correo',
    html: '<html>' +
      '<head>' +
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' +
      '<style>' +
      '.card {' +
      'box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);' +
      'max-width: 450px;' +
      'margin: auto;' +
      'text-align: center;' +
      'font-family: arial;' +
      '}' +
      '.title {' +
      'color: black;' +
      'font-size: 18px;' +
      'font-weight: bold;' +
      '}' +
      'button {' +
      'border: none;' +
      'outline: 0;' +
      'display: inline-block;' +
      'padding: 8px;' +
      'color: white;' +
      'background-color: #E4220F;' +
      'text-align: center;' +
      'cursor: pointer;' +
      'width: 100%;' +
      'font-size: 18px;' +
      '}' +
      'a {' +
      'text-decoration: none;' +
      'font-size: 22px;' +
      'color: black;' +
      '}' +
      'button:hover, a:hover {' +
      'opacity: 0.7;' +
      '}' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div class="card">' +
      `<img src="cid:cid_imagen_correo_reserva" alt="Cumple" style="width:95%">` +
      '<h1>FELICIDADES 🎉🎉</h1>' +
      `<p>${clienteNombre}, TU RESERVA SE HA HECHO CON EXITO ! ✅</p>` +
      '<p class="title">Datos de la reserva:</p>' +
      `<p>Tu numero de reserva es: <b>${numeroReserva}</b></p>` +
      `<p>La fiesta empieza: <b>${fechaInicio}</b></p>` +
      `<p>Y termina: <b>${fechaTermino}</b></p>` +
      `<p>El precio total: <b>$${totalReserva}</b></p>` +
      `<p>El lugar de la fiesta es: <b>${direccionReserva}</b></p>` +
      '<h3>NOS VEMOS PRONTO PARA CELEBRAR CON ALICIA KIDS !!! 🥳🎈</h3>' +
      '<p><button>Cancelar Reserva</button></p>' +
      '</div>' +
      '</body>' +
      '</html>',
    attachments: [{
      filename: 'cumple_correo.jpg',
      path: ruta +'public/images/cumple_correo.jpg',
      cid: 'cid_imagen_correo_reserva'
    }]
  }
 
  return mailReserva
} 