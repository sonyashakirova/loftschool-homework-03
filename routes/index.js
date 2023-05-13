import express from 'express'
import admin from './admin.js'
import login from './login.js'
import main from './main.js'

const router = express.Router()

router.use('/', main)
router.use('/login', login)
router.use('/admin', admin)

export default router
