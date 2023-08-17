import { Router } from 'express'

import { getCliente, updateDatosCliente } from '../controllers/cliente.controller.js'

const router = Router()

router.get('/cliente', getCliente)
router.post('/cliente/update', updateDatosCliente)


export default router