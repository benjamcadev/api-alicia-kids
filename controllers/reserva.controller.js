import { Reserva } from '../models/Reserva.js'
import { Cliente } from '../models/Cliente.js'
import { sequelize } from '../database/conexion.js'

export const createReserva = async (req,res) => {

//Rescatar campos de query, se recibe un array de objetos, cada objeto reserva a un juego.
    const { reservas, cliente } = req.body

// Registrar cliente
    let nuevoCliente;

    try {

        nuevoCliente = await Cliente.create({
        nombre_cliente: cliente.nombre_cliente,
        correo_cliente: cliente.correo_cliente
        })
        
    } catch (error) {
        return res.status(400).json(
            {
                message: "Error al registrar nuevo cliente",
                status: "error",
                details: error
            }
        )
    }


// Sacar el numero de la ultima reverva
    const {dataValues: ultimaReserva} = await Reserva.findOne({  
        order: [ [ 'createdAt', 'DESC' ]],
    })
    const numeroUltimaReserva = ultimaReserva.numero_reserva

// Registrar Reserva
    try {
        
            const reservaNueva = await Promise.all(
            reservas.map( async (reserva) => {
                return await Reserva.create({
                    numero_reserva: numeroUltimaReserva + 1,
                    fecha_inicio_reserva: reserva.fecha_inicio_reserva,
                    fecha_termino_reserva: reserva.fecha_termino_reserva,
                    total_reserva: reserva.total_reserva,
                    estado_reserva: true
                })
            })
            )

            //Recorremos el array para sacar info de los juegos para el cliente

            const juegos = reservaNueva.map((reserva) => {
            return reserva.dataValues.fk_juego
            }) 

            const reservaFinal = {
                cliente: {nombre: nuevoCliente.nombre_cliente,
                        correo: nuevoCliente.correo_cliente
                        },
                numero_reserva: reservaNueva[0].numero_reserva,
                fecha_inicio_reserva:  reservaNueva[0].fecha_inicio_reserva,
                fecha_termino_reserva:  reservaNueva[0].fecha_termino_reserva,
                total_reserva:  reservaNueva[0].total_reserva,
                juegos: juegos
            }
            console.log(reservaFinal);

            return res.status(200).json({
                reservaFinal
            })


    } catch (error) {
        return res.status(400).json(
            {
                message: "Error al registrar la reserva",
                status: "error",
                details: error
            }
        )
    }





//Crear nueva reserva
// const newReserva = await Reserva.create({
//     numero_reserva: numeroUltimaReserva + 1,
//     correo_usuario,
//     pass_usuario,
//     last_login_usuario: sequelize.literal('NOW()')
// })
}


