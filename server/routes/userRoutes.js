import express from 'express'
import { getUserProfileController, loginContoller, logoutController, registerController ,updateProfileController,updatePasswordController,updateProfilePicController} from '../controllers/userController.js'
import { isAuth } from '../middlewares/authMiddleware.js'
import { singleUpload } from '../middlewares/multer.js'

//router object
const router= express.Router()

//routes register
router.post('/register',registerController)

//route login
router.post('/login',loginContoller)

//profile
router.get('/profile',isAuth , getUserProfileController);

//logout
router.get('/logout',logoutController);

//update profile
router.put('/profile-update',isAuth,updateProfileController);

//update password
router.put('/update-password' ,isAuth,updatePasswordController);

//update-profile-pic
router.put("/update-picture",isAuth ,singleUpload , updateProfilePicController)

//export
export default router