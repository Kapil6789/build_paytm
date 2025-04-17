
import prisma from "../prisma/db.config.js"
import z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../jwt_secret/config.js"

const parse = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    balance: z.string().optional(),
})


//signup
export const signUpUser = async (req, res) => {
    const { username, password, lastName, firstName, balance } = req.body
    const success = parse.safeParse(req.body)
    console.log(success)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
                lastName: lastName,
                firstName: firstName,
                balance: parseInt(balance)
            }
        })
       

        const token = jwt.sign({
            userId: newUser.id
        }, JWT_SECRET)
        // res.cookie("token", token)
    

       await prisma.account.create({
       
        data:{
            userId:newUser.id,
            balance:parseInt(balance)
        }
       })


        return res.status(200).json({
            token: token, message: "user created successfully", user: newUser
        })

    }
    catch (err) {
        console.log(err)
        res.send("errors are" + err)
    }

}


//signin


export const signInUser = async (req, res) => {
    const { username, password } = req.body;
    const success = parse.safeParse(req.body);
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { username: username },
            select: {
                username: true,
                password: true,
                id: true
            }
        });
        
        if (!user) {
            return res.status(404).json({
                message: "No user found"
            });
        }

        if (user.password !== password) {
          return res.status(401).json({
            message: "Invalid credentials"
          });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        return res.status(200).json({
            token: token,
            message: "Sign in successfully"
        });
    }
    catch (err) {
        console.error("Error in signInUser:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

//update user


export const updateUser = async (req, res) => {

    const { id, username, password } = req.body
    const success = parse.safeParse(req.body)

    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,

        });
    }
    try {
        const allUser = prisma.user.findMany({
            where: {
                id: parseInt(id)
            }
        })
        if (!allUser) {
            return res.status(404).json({
                message: "no user found"
            })
        }
        else {
            const updateUser = await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    username: username,
                    password: password,
                }
            })
            res.status(411).json({
                message: "update user successfully", user: updateUser
            })

        }
    }
    catch (err) {
        res.send("error are " + err)
        console.log(err)
    }
}

//find user

export const findUser = async (req, res) => {
    const { username } = req.body
    const success = parse.safeParse(req.body)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { username: username },
            select: {
                username: true,
                lastName: true,
                id: true,
                firstName: true,
            }
        });
        if (!user) {
            return res.status(404).json({ 
                message: "No user found" 
            });
        }
        return res.status(200).json({ user: user });
        }
    
    catch (err) {
        res.json("error occured " + err)
        console.log(err)
    }
}