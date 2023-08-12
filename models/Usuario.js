import {DataTypes} from 'sequelize'
import { sequelize } from '../database/conexion.js'



export const Usuario = sequelize.define('usuario',{
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING
    },
    correo_usuario: {
        type: DataTypes.STRING
    },
    pass_usuario: {
        type: DataTypes.TEXT
    },
    last_login_usuario: {
        type: DataTypes.DATE
    }


})