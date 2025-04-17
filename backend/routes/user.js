import {Router} from "express"
import {signUpUser} from "../controller/userController.js"
import {signInUser} from "../controller/userController.js"
import {updateUser} from "../controller/userController.js"
import {findUser} from "../controller/userController.js"

const router = Router()

router.post("/signup",signUpUser)
router.post("/signin",signInUser)
router.put("/update",updateUser)
router.get("/",findUser)


export default router