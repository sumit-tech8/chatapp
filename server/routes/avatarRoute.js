import express from 'express'

import { setAvatarController } from '../controllers/authController.js'

//router object
const router = express.Router()

//routing
router.post('/setAvatar/:id', setAvatarController) 
  


export default router;