import { Cliente } from '../models/Cliente.js'


export const updateDatosCliente = async (req,res) => {

    const { correo_cliente, nombre_cliente } = req.body
    const respuesta = await Cliente.findOne({ where: { correo_cliente:  correo_cliente} })

    
    if(respuesta){
        // Si el correo existe actualizamos nombre
        try {
            const resultado = await Cliente.update(
                { nombre_cliente: nombre_cliente },
                { where: {correo_cliente: correo_cliente}}
                )
            if(resultado){
                return res.json({
                    ...respuesta.dataValues,
                    status: "success",
                    message: "Actualizado",
                    upgrade: true
                })
            }
        }catch(error){
            return res.status(400).send(
            {
                status: "error",
                message: "Hubo un problema al actualizar nombre del correo"
            })
        }
        
    }
    return res.json({
        status: "success",
        message: "No registra",
        upgrade: false
    })
}

export const getCliente = (req,res) => {
    return res.send('clientes')
} 