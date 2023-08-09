import app from './src/app.js'
import { sequelize }  from './database/conexion.js' 

import './models/Cliente.js'
import './models/Juego.js'
import './models/Reserva.js'

const main = async () => {
    try {
        await sequelize.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        
    }
   
}

main()

app.listen(3000)

console.log('Servidor corriendo en el port', 3000);