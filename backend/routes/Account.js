import {Router} from "express"
import {tranferFunds,findBalance} from "../controller/bankController.js"
const router=Router()

router.post("/tranferFunds",tranferFunds)
router.get("/getBalance",findBalance)


export default router

