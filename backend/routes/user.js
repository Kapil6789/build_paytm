import {Router} from "express"
import {signUpUser} from "../controller/userController.js"
import {signInUser} from "../controller/userController.js"
import {updateUser} from "../controller/userController.js"
import {findUser, getCurrentUser, searchUsers} from "../controller/userController.js"
import {requireAuth} from "../middleware/auth.js"

const router = Router()

router.post("/signup",signUpUser)
router.post("/signin",signInUser)
router.put("/update",updateUser)
router.get("/me",requireAuth,getCurrentUser)
router.get("/search",requireAuth,searchUsers)
router.get("/",findUser)


export default router
