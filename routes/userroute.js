import express, { Router } from 'express'
import userAuth from '../middlewares/authmiddleware.js';
import { updateUserController } from '../controller/usercontroller.js';
const router = express.Router()

// UPDATE USER
router.put('/update-user', userAuth, updateUserController)
export default router;