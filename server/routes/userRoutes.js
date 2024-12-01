import express from 'express'
import { loginContoller, registerController } from '../controllers/userController.js'

//router object
const router= express.Router()

//routes register
router.post('/register',registerController)

//route login
router.post('/login',loginContoller)

//export
export default router