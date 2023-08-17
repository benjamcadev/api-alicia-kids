import { Cliente } from '../models/Cliente.js'
import { sequelize } from '../database/conexion.js'

export const updateDatosCliente = async (req,res) => {

    const { correo_cliente, nombre_cliente } = req.body
    const {dataValues: datosCliente} = await Cliente.findOne({ where: { correo_cliente:  correo_cliente} })
    
    if(datosCliente){
        // Si el correo existe actualizamos nombre
        try {
            const resultado = await Cliente.update(
                { nombre_cliente: nombre_cliente },
                { where: {correo_cliente: correo_cliente}}
                )
            if(resultado){
                return res.send(resultado)
            }
        }catch(error){
            return res.status(400).send(
            {
                status: "error",
                message: "Hubo un problema al actualizar nombre del correo"
            })
        }
        
    }
    return res.send(datosCliente)
}

export const getCliente = (req,res) => {
    return res.send('clientes')
} 