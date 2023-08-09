import {DataTypes} from 'sequelize'
import { sequelize } from '../database/conexion.js'

export const Cliente = sequelize.define('cliente',{
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_cliente: {
        type: DataTypes.STRING

    },
    correo_cliente: {
        type: DataTypes.STRING
    }
})