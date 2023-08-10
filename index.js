import app from './src/app.js'
import { sequelize }  from './database/conexion.js' 



const main = async () => {
    try {
        await sequelize.sync() // Sincronizando con la bd en AWS
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        
    }
   
}

main()

app.listen(3000)

console.log('Servidor corriendo en el port', 3000);