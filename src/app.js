import express from 'express'
import usuarioRoutes from '../routes/usuario.routes.js'
import reservaRoutes from '../routes/reserva.routes.js'
import clienteRoutes from '../routes/cliente.routes.js'
import juegoRoutes from '../routes/juego.routes.js'

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(usuarioRoutes)
app.use(reservaRoutes)
app.use(clienteRoutes)
app.use(juegoRoutes)

export default app