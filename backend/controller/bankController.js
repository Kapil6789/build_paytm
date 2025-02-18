import prisma from "../prisma/db.config.js"



export const tranferFunds = async (req, res) => {
   const { fromAccountId, toAccountId, amount } = req.body

   if (!fromAccountId || !toAccountId || !amount) {
      res.send("invalid input")
   }

   try {

      const result = await prisma.$transaction(async (primsa) => {
         const balanceFrom = await prisma.account.findFirst({
            where: {
               userId: parseInt(fromAccountId)
            }

         })

         if (!balanceFrom) {
            throw new Error("sender account not found")
         }

         if (!balanceFrom || balanceFrom.balance < parseInt(amount)) {
            res.json({
               message: "insufficient balance"
            })
         }

         const balanceTo = await prisma.account.findFirst({
            where: {
               userId: parseInt(toAccountId)
            }
         })

         if (!balanceTo) {
            throw new Error("reciever account not found")
         }

         await prisma.account.update({
            where: {
               userId: parseInt(fromAccountId)
            },
            data: {
               balance: balanceFrom.balance - parseInt(amount)
            }
         })

         await prisma.account.update({
            where: {
               userId: parseInt(toAccountId)
            },
            data: {
               balance: balanceTo.balance + parseInt(amount)
            }
         })

        
      })
      
      res.status(200).send({
         message: "transaction done successfully",
         result:result
      })
      
   }
   catch (err) {
         console.log("error is " + err)
   }
  
}

export const findBalance = async (req, res) => {
   const { id } = req.body
   const amount = await prisma.account.findUnique({
      where: {
         userId: parseInt(id)
      }
   })
   res.status(200).json({
      message: amount.balance
   })
}