import { Cliente } from '../models/Cliente.js'


export const verifyClient = async (cliente) => {
    // Registrar cliente
    let nuevoCliente;

    try {
        //Verificar si existe cliente
        const respuesta = await Cliente.findOne({ where: { correo_cliente: cliente.correo_cliente } })

        if (!respuesta) {
            return nuevoCliente = await Cliente.create({
                nombre_cliente: cliente.nombre_cliente,
                correo_cliente: cliente.correo_cliente
            })
        } else {
            return nuevoCliente = respuesta.dataValues
        }

    } catch (error) {
        return (
            {
                message: "Error al registrar nuevo cliente",
                status: "error",
                details: error
            }
        )

    }
}
