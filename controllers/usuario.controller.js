import { Usuario } from '../models/Usuario.js'
import { sequelize } from '../database/conexion.js'
import bcrypt from 'bcrypt'


export const getUsuario = async (req,res) => {
    const usuarios = await Usuario.findAll()

    res.json(usuarios)
}

export const loginUsuario = async (req,res) => {

    const {nombre_usuario, correo_usuario, pass_usuario} = req.body

    //Buscar user en la bd
    const user = await Usuario.findOne({ where: { correo_usuario:  correo_usuario} });

    console.log(user);

    //Verificar password con bcrypt
     const pwd =  bcrypt.compareSync(pass_usuario, user.dataValues.pass_usuario);

     if (!pwd) {
        return res.status(400).send(
            {
                status: "error",
                message: "No te has identificado correctamente"
            }
        )
       }
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

   

    res.send(newUsuario.dataValues)
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

