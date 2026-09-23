import {Router} from "express"
import {tranferFunds,findBalance} from "../controller/bankController.js"
import {requireAuth} from "../middleware/auth.js"
const router=Router()

router.post("/transferFunds",requireAuth,tranferFunds)
router.get("/getBalance",requireAuth,findBalance)


export default router

