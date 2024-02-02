import express from 'express'

import { getAllUsersController, loginController, registerController} from '../controllers/authController.js'

//router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register', registerController) 
  
//LOGIN || POST 
router.post('/login', loginController)

//Alluser
router.get('/allusers/:id', getAllUsersController)


export default router;