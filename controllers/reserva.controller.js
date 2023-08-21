import { Reserva } from '../models/Reserva.js'
import { Cliente } from '../models/Cliente.js'
import { sequelize } from '../database/conexion.js'
import { Op } from 'sequelize'
import { convertTZ } from '../helpers/convertTZ.js'



export const createReserva = async (req,res) => {
//Rescatar campos de query, se recibe un array de objetos, cada objeto reserva a un juego.
    const { reservas, cliente } = req.body

    

// Verificar que no hya otra reserva para la fecha

    if (reservas) {  
         
        const shortDateInicio = reservas[0].fecha_inicio_reserva.split(" ")

       
        
        const reserva = await Reserva.findAll({
            where: {  
                fecha_inicio_reserva:{
                    [Op.between]: [
                        `${shortDateInicio[0]} 00:00:00` ,
                        `${shortDateInicio[0]} 23:59:00`
                    ]         
                },
                fk_juego: { [Op.eq]: 7}
                       
               
            }
        })

        return res.send(reserva)

        
    }
     

// Registrar cliente
    let nuevoCliente;

    try {
        //Verificar si existe cliente
        const respuesta = await Cliente.findOne({ where: { correo_cliente:  cliente.correo_cliente} })

        if (!respuesta) {
            nuevoCliente = await Cliente.create({
                nombre_cliente: cliente.nombre_cliente,
                correo_cliente: cliente.correo_cliente
            })
        }else{
            nuevoCliente = respuesta.dataValues
        }
      
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
                    estado_reserva: true,
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
                details: error.message
            }
        )
    }

}

export const getReservaDate= async (req,res) => {
    //Enviar las reservas hechas el mes pedido
    const { date } = req.body

    if (date) {
        const reservas = await Reserva.findAll({
            where: { 'fecha_inicio_reserva': {[Op.between]: [`${date} 00:00:00`,`${date} 23:59:59` ]} }
        })

        //Actualizamos la zona horaria de las fecha, ya que al parecer tiene problema el modulo pg, devuelve fechas en UTC
        const reservasTZ = convertTZ(reservas)

        res.json(reservasTZ)

    }else{
        res.status(400).send('Error al traer reservas por mes')
    }
    

   
}


