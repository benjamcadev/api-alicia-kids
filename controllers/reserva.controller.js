import { Reserva } from '../models/Reserva.js'
import { Cliente } from '../models/Cliente.js'
import { sequelize } from '../database/conexion.js'
import { Op } from 'sequelize'
import { convertTZ, convertTZOneDate } from '../helpers/convertTZ.js'
import { verifyClient } from '../helpers/verifyClient.js'
import { sendEmail, emailReserva } from '../helpers/email.js'

export const deleteReserva = async (req, res) => {

    const numero_reserva  = req.params.id

    if (numero_reserva) {
        //Hacer update en el flag estado_reserva
       const resultadoUpdate = await Reserva.update({ estado_reserva: false }, {
            where: {
              numero_reserva: numero_reserva,
              estado_reserva: true
            }
          })
        
        console.log(resultadoUpdate) 

        if (resultadoUpdate != 0) {
            return res.status(200).json(
                {
                    message: "Reserva cancelada con exito",
                    status: "success"
                }
            )
        }else{
            return res.status(400).json(
                {
                    message: "No existe reserva",
                    status: "error"
                }
            )
        }
  
    }else{
        return res.status(400).json(
            {
                message: "Faltan datos para eliminar la reserva",
                status: "error"
            }
        )
    }
}

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
                    fk_juego: { 
                        [Op.eq]: reserva.fk_juego 
                    },
                    estado_reserva: {
                        [Op.eq]: true
                    }
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
                let dateInicioString = dateInicio.toLocaleString('es-CL', { timeZone: 'UTC' });
          
                const dateTermino = new Date(reservaNueva[0].fecha_termino_reserva);
                let dateTerminoString = dateTermino.toLocaleString('es-CL', { timeZone: 'UTC' });

                const mail = emailReserva(
                    cliente.correo_cliente,
                    reservaFinal.cliente.nombre,
                    reservaFinal.numero_reserva,
                    dateInicioString,
                    dateTerminoString,
                    reservaFinal.total_reserva,
                    reservaFinal.direccion_reserva
                )

                try {
                    const respuestaCorreo = await sendEmail(mail)

                } catch (error) {
                    return res.status(400).json({
                        message: "Error al enviar correo de reserva",
                        status: "error",
                        details: error.message
                    })
                }  

                return res.status(200).json({
                    status: "success",
                    reserva: reservaFinal
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

        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials" : "true" 
        });

        res.status(200).json(reservasTZ)

    } else {
        res.status(400).send('Error al traer reservas por mes')
    }



}


