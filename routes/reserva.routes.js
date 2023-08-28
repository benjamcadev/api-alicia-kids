import { Router } from 'express'

import { createReserva,  getReservaDate , deleteReserva} from '../controllers/reserva.controller.js'

const router = Router()

router.get('/reservas', getReservaDate)
router.post('/reservas/create',createReserva)
router.delete('/reservas/remove/:id',deleteReserva)


export default router