import {Router} from "express"
import userRouter from "./user.js"
import accountRouter from "./Account.js"
const router=Router()

router.use("/user",userRouter)
router.use("/account",accountRouter)



export default router
