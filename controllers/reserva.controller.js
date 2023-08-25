import { Reserva } from '../models/Reserva.js'
import { Cliente } from '../models/Cliente.js'
import { sequelize } from '../database/conexion.js'
import { Op } from 'sequelize'
import { convertTZ, convertTZOneDate } from '../helpers/convertTZ.js'
import { verifyClient } from '../helpers/verifyClient.js'
import { sendEmail } from '../helpers/sendEmail.js'



export const createReserva = async (req, res) => {
    //Rescatar campos de query, se recibe un array de objetos, cada objeto reserva a un juego.
    const { reservas, cliente } = req.body

    // Verificar que no hya otra reserva para la fecha
    if (reservas) {

        let reservasExistentes = []

        for (const reserva of reservas) {

            const shortDateInicio = reserva.fecha_inicio_reserva.split(" ")

            const reservaExistente = await Reserva.findAll({
                where: {
                    fecha_inicio_reserva: {
                        [Op.between]: [
                            `${shortDateInicio[0]} 00:00:00`,
                            `${shortDateInicio[0]} 23:59:00`
                        ]
                    },
                    fk_juego: { [Op.eq]: reserva.fk_juego }
                }
            })

            if (reservaExistente.length > 0) {
                reservasExistentes = [
                    ...reservasExistentes,
                    reservaExistente
                ]
            }
        }

        if (reservasExistentes.length > 0) {
            return res.status(400).json(
                {
                    message: "Error al reservar, ya existe una reserva",
                    status: "error",
                    detalle: reservasExistentes

                }
            )
        } else {

            // Registrar cliente
            let nuevoCliente = await verifyClient(cliente)

            if (nuevoCliente.status == 'error') {
                return res.status(400).json(nuevoCliente)
            }

            // Sacar el numero de la ultima reverva
            const { dataValues: ultimaReserva } = await Reserva.findOne({
                order: [['createdAt', 'DESC']],
            })

            
            const numeroUltimaReserva = ultimaReserva.numero_reserva

            // Registrar Reserva
            try {

                const reservaNueva = await Promise.all(
                    reservas.map(async (reserva) => {
                        return await Reserva.create({
                            numero_reserva: numeroUltimaReserva + 1,
                            fecha_inicio_reserva: reserva.fecha_inicio_reserva,
                            fecha_termino_reserva: reserva.fecha_termino_reserva,
                            total_reserva: reserva.total_reserva,
                            estado_reserva: true,
                            direccion_reserva: reserva.direccion_reserva,
                            fk_juego: reserva.fk_juego,
                            fk_cliente: nuevoCliente.id_cliente
                        })
                    })
                )
                //Recorremos el array para sacar info de los juegos para el cliente

                const juegos = reservaNueva.map((reserva) => {
                    return reserva.dataValues.fk_juego
                })

                const reservaFinal = {
                    cliente: {
                        nombre: nuevoCliente.nombre_cliente,
                        correo: nuevoCliente.correo_cliente
                    },
                    numero_reserva: reservaNueva[0].numero_reserva,
                    fecha_inicio_reserva: convertTZOneDate(reservaNueva[0].fecha_inicio_reserva),
                    fecha_termino_reserva: convertTZOneDate(reservaNueva[0].fecha_termino_reserva),
                    total_reserva: reservaNueva[0].total_reserva,
                    direccion_reserva: reservaNueva[0].direccion_reserva,
                    juegos: juegos
                }
                
                //Enviar correo

                //Transformando fechas para el correo
                const dateInicio = new Date(reservaNueva[0].fecha_inicio_reserva);
                let dateInicioString = dateInicio.toLocaleString();

                const dateTermino = new Date(reservaNueva[0].fecha_termino_reserva);
                let dateTerminoString = dateTermino.toLocaleString();

                const mailReserva = {
                    from: '"Alicia Kids" <alicia.kids.juegos@gmail.com>',
                    to: cliente.correo_cliente,
                    cc: 'benjamca@icloud.com',
                    subject: 'Reserva de juegos ✅ - Alicia Kids',
                    text: 'Texto del correo',
                    html: `<h1>FELICIDADES 🎉🎉</h1> <h2>${reservaFinal.cliente.nombre}, TU RESERVA SE HA HECHO CON EXITO ! ✅</h2>`+
                    '<br>'+
                    '<h3>Datos de la Reserva:</h3>'+
                    '<br>'+
                    `<p>Tu numero de reserva es: <b>${reservaFinal.numero_reserva}</b></p>`+
                    `<p>La fiesta empieza: <b>${dateInicioString}</b></p>`+
                    `<p>Y termina: <b>${dateTerminoString}</b></p>`+
                    `<p>El precio total: <b>$${reservaFinal.total_reserva}</b></p>`+
                    `<p>El lugar de la fiesta es: <b>${reservaFinal.direccion_reserva}</b></p>`+
                    '<br>'+
                    `<h3>NOS VEMOS PRONTO PARA CELEBRAR CON ALICIA KIDS !!! 🥳🎈</h3>`
                  }

                

                try {
                    const respuestaCorreo = await sendEmail(mailReserva)
                    //console.log(respuestaCorreo)

                } catch (error) {
                    return res.status(400).json({
                        message: "Error al enviar correo de reserva",
                        status: "error",
                        details: error.message
                    })
                }  


                return res.status(200).json({
                    reservaFinal
                })

            } catch (error) {
                return res.status(400).json(
                    {
                        message: "Error al registrar la reserva",
                        status: "error",
                        details: error.message
                    }
                )
            }
        }
    } else {
        return res.status(400).json(
            {
                message: "Faltan datos de reserva",
                status: "error"
            }
        )
    }
}

export const getReservaDate = async (req, res) => {
    //Enviar las reservas hechas el mes pedido
    const { date } = req.body

    if (date) {
        const reservas = await Reserva.findAll({
            where: { 'fecha_inicio_reserva': { [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`] } }
        })

        //Actualizamos la zona horaria de las fecha, ya que al parecer tiene problema el modulo pg, devuelve fechas en UTC
        const reservasTZ = convertTZ(reservas)

        res.json(reservasTZ)

    } else {
        res.status(400).send('Error al traer reservas por mes')
    }



}


