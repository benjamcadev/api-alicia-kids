import { Usuario } from '../models/Usuario.js'
import { sequelize } from '../database/conexion.js'
import bcrypt from 'bcrypt'
import { createToken } from '../helpers/jwt.js'

export const getDatosCorreo = async (req,res) => {
    const { correo_usuario, nombre_usuario } = req.body
    const {dataValues: datosUser} = await Usuario.findOne({ where: { correo_usuario:  correo_usuario} })
    
    if(datosUser){
        // Si el correo existe actualizamos nombre
        try {
            const resultado = await Usuario.update(
                { nombre_usuario: nombre_usuario },
                { where: {correo_usuario: correo_usuario}}
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
    return res.send(datosUser)
}

export const getUsuario = async (req,res) => {
    const usuarios = await Usuario.findAll()

    res.json(usuarios)
}

export const loginUsuario = async (req,res) => {

    const {correo_usuario, pass_usuario} = req.body

    //Validando parametros
    if (!correo_usuario || !pass_usuario) {
        return res.status(404).send({
            status: "error",
            message: "faltan datos por enviar"
        })
    }

    //Buscar user en la bd
    const {dataValues: datosUser} = await Usuario.findOne({ where: { correo_usuario:  correo_usuario} });


    //Verificar password con bcrypt
     const pwd =  bcrypt.compareSync(pass_usuario, datosUser.pass_usuario);

     if (!pwd) {
        return res.status(400).send(
            {
                status: "error",
                message: "No te has identificado correctamente"
            }
        )
    }

    //Generamos token
    const token = createToken(datosUser)

    return res.status(200).send({
        status: "success",
        message: "Te has identificado correctamente",
        user: {
                    nombre_usuario: datosUser.nombre_usuario,
                    correo_usuario: datosUser.correo_usuario
                },
        token
    })


}

export const createUsuario = async (req,res) => {

    //Hash password
    const salt = await bcrypt.genSalt(10)
    req.body.pass_usuario = await bcrypt.hash(req.body.pass_usuario, salt)

    const {nombre_usuario, correo_usuario, pass_usuario} = req.body

     //Comprobar que me llegan bien y validarlos
     if(!nombre_usuario || !correo_usuario || !pass_usuario){
        console.log("VALIDACION INCORRECTA");
        
        return res.status(400).json(
            {
                message: "Faltan datos por enviar",
                status: "error"
            }
        )
    }

    const newUsuario = await Usuario.create({
        nombre_usuario,
        correo_usuario,
        pass_usuario,
        last_login_usuario: sequelize.literal('NOW()')
    })

   

    if (!newUsuario) {
        return res.status(400).json(
            {
                message: "Hubo un error al crear usuario nuevo",
                status: "error"
            }
        )
    }

    // Borramos las pass y el id usuario
    delete newUsuario.dataValues.pass_usuario
    delete newUsuario.dataValues.id_usuario
   

    res.status(200).send(newUsuario.dataValues)
}

// const getDateTime = () => {
//     let dateObj = new Date();
//     let month = dateObj.getMonth() + 1; //months from 1-12
//     let day = dateObj.getDate();
//     let year = dateObj.getFullYear();
//     let hour = dateObj.getHours() - 4;
//     let minutes = dateObj.getMinutes();
//     let seconds = dateObj.getSeconds();

// return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":"+ seconds;
// }

