import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import usuarioRoutes from '../routes/usuario.routes.js'
import reservaRoutes from '../routes/reserva.routes.js'
import clienteRoutes from '../routes/cliente.routes.js'
import juegoRoutes from '../routes/juego.routes.js'

const app = express()

// SI QUIERO LIMITAR LOS DOMINIOS QUE HACEN PETICIONES OCUPAMOS LAS cosrOptions en cors()
const whitelist = ['http://localhost:3000','http://localhost:3900'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}


//middlewares
app.use(cors({credentials: true, origin: true}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(usuarioRoutes)
app.use(reservaRoutes)
app.use(clienteRoutes)
app.use(juegoRoutes)

export default app