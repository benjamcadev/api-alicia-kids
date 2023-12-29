import { Router } from 'express'

import { getUsuario, createUsuario, loginUsuario, getProfileLogged, logoutUsuario } from '../controllers/usuario.controller.js'

const router = Router()

router.get('/usuarios', getUsuario)
router.post('/usuarios/create',createUsuario)
router.post('/usuarios/login',loginUsuario)
router.post('/usuarios/verify', getProfileLogged )
router.post('/usuarios/logout', logoutUsuario)

export default router