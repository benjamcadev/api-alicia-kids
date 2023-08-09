import {DataTypes} from 'sequelize'
import { sequelize } from '../database/conexion.js'

export const Juego = sequelize.define('juego',{
    id_juego: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_juego:{
        type: DataTypes.STRING
    },
    categoria_juego: {
        type: DataTypes.STRING
    },
    precio_juego: {
        type: DataTypes.INTEGER
    },
    flag_delete_juego: {
        type: DataTypes.BOOLEAN
    },
    imagen_juego: {
        type: DataTypes.TEXT
    },
    descripcion_juego: {
        type: DataTypes.TEXT
    }
})