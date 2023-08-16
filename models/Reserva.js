import {DataTypes} from 'sequelize'
import { sequelize } from '../database/conexion.js'
import { Juego } from './Juego.js'
import { Cliente } from './Cliente.js'

export const Reserva = sequelize.define('reserva',{
    id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_reserva: {
        type: DataTypes.INTEGER
    
    },
    fecha_inicio_reserva: {
        type: DataTypes.DATE
    },
    fecha_termino_reserva: {
        type: DataTypes.DATE
    },
    total_reserva: {
        type: DataTypes.INTEGER
    },
    estado_reserva: {
        type: DataTypes.BOOLEAN
    }

})

Juego.hasMany(Reserva, {
    foreignKey: 'fk_juego',
    sourceKey: 'id_juego'
})

Reserva.belongsTo(Juego, {
    foreignKey: 'fk_juego',
    targetId: 'id_juego'
})

Cliente.hasMany(Reserva, {
    foreignKey: 'fk_cliente',
    sourceKey: 'id_cliente'
})

Reserva.belongsTo(Cliente, {
    foreignKey: 'fk_cliente',
    targetId: 'id_cliente'
})