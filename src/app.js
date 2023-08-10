import express from 'express'
import usuarioRoutes from '../routes/usuario.routes.js'

const app = express()

//middlewares
app.use(express.json())

app.use(usuarioRoutes)

export default app