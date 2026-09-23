import prisma from "../prisma/db.config.js"



export const tranferFunds = async (req, res) => {
   const toAccountId = Number(req.body.toAccountId);
   const amount = Number(req.body.amount);
   const fromAccountId = req.userId;

   if (!Number.isInteger(toAccountId) || toAccountId < 1 || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ message: "Enter a valid recipient and a whole amount greater than zero." });
   }
   if (toAccountId === fromAccountId) {
      return res.status(400).json({ message: "You can’t send money to your own account." });
   }

   try {
      const balances = await prisma.$transaction(async (tx) => {
         const sender = await tx.account.findUnique({ where: { userId: fromAccountId } });
         if (!sender) throw Object.assign(new Error("Your wallet account was not found."), { status: 404 });
         if (sender.balance < amount) throw Object.assign(new Error("Your balance is too low for this transfer."), { status: 400 });

         const recipient = await tx.account.findUnique({ where: { userId: toAccountId } });
         if (!recipient) throw Object.assign(new Error("The recipient’s wallet was not found."), { status: 404 });

         const [updatedSender, updatedRecipient] = await Promise.all([
            tx.account.update({ where: { userId: fromAccountId }, data: { balance: { decrement: amount } } }),
            tx.account.update({ where: { userId: toAccountId }, data: { balance: { increment: amount } } }),
         ]);
         return { sender: updatedSender.balance, recipient: updatedRecipient.balance };
      });

      return res.json({ message: "Transfer complete.", balance: balances.sender });
   } catch (err) {
      console.error("Transfer failed:", err);
      return res.status(err.status ?? 500).json({ message: err.status ? err.message : "The transfer could not be completed." });
   }
};

export const findBalance = async (req, res) => {
   try {
      const account = await prisma.account.findUnique({ where: { userId: req.userId } });
      if (!account) return res.status(404).json({ message: "Wallet account not found." });
      return res.json({ balance: account.balance });
   } catch (err) {
      console.error("Could not load balance:", err);
      return res.status(500).json({ message: "Could not load your balance." });
   }
}
