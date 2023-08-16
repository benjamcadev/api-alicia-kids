import { Router } from 'express'

import { createReserva } from '../controllers/reserva.controller.js'

const router = Router()

// router.get('/reservas', getReserva)
router.post('/reservas/create',createReserva)


export default router