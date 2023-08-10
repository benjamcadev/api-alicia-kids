import { Router } from 'express'

import { getUsuario, createUsuario } from '../controllers/usuario.controller.js'

const router = Router()

router.get('/usuarios', getUsuario)
router.post('/usuarios',createUsuario)

export default router