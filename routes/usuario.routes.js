import { Router } from 'express'

import { getUsuario, createUsuario, loginUsuario } from '../controllers/usuario.controller.js'

const router = Router()

router.get('/usuarios', getUsuario)
router.post('/usuarios/create',createUsuario)
router.post('/usuarios/login',loginUsuario)

export default router