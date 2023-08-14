import express from 'express'
import usuarioRoutes from '../routes/usuario.routes.js'
import reservaRoutes from '../routes/reserva.routes.js'

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(usuarioRoutes)
app.use(reservaRoutes)

export default app