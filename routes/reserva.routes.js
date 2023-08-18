import { Router } from 'express'

import { createReserva,  getReservaDate } from '../controllers/reserva.controller.js'

const router = Router()

router.get('/reservas', getReservaDate)
router.post('/reservas/create',createReserva)


export default router