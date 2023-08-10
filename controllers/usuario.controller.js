import { Usuario } from '../models/Usuario.js'
import { sequelize } from '../database/conexion.js'

export const getUsuario = (req,res) => {
    res.send('get usuarios')
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

export const createUsuario = async (req,res) => {
    const {nombre_usuario, correo_usuario, pass_usuario} = req.body

    const newUsuario = await Usuario.create({
        nombre_usuario,
        correo_usuario,
        pass_usuario,
        last_login_usuario: sequelize.literal('NOW()')
    })

    console.log(newUsuario)

    res.send('creando usuario')
}