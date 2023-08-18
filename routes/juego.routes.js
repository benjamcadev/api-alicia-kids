import { Router } from 'express'
import { getJuegos } from '../controllers/juego.controller.js'

const router = Router()

router.get('/juego/',getJuegos)


export default router